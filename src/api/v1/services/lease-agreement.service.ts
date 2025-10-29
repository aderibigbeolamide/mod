import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { dataSource } from '../../../config/database.config.js';
import { RequestToRentEntity } from '../entities/request-to-rent.entity.js';
import { PropertyEntity, PropertyUnitEntity } from '../entities/property.entity.js';
import { LessorInfoEntity } from '../entities/lessor-info.entity.js';
import { UserEntity } from '../entities/user.entity.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { logger } from '../../../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface LeaseAgreementData {
  currentDate: string;
  property: {
    address: string;
    city: string;
    state: string;
    type: string;
    leaseTerm: string;
    leasePolicy: any;
    utilities: any;
  };
  unit: {
    label: string;
    price: number;
    noOfBedrooms: number;
    noOfBathrooms: number;
    squareFeet?: number;
    dateAvailable: string;
    paymentSchedule: string;
    hasAgencyFee: boolean;
    agencyFeePercentage?: number;
    fixedAgencyFee?: number;
  };
  lessor: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    agencyName?: string;
  };
  tenant: {
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    currentAddress: string;
    moveInDate: string;
  };
}

export class LeaseAgreementService {
  private templatePath = path.join(__dirname, '../templates/lease-agreement.hbs');

  async generateLeaseAgreement(requestToRentId: string): Promise<Buffer> {
    const requestToRent = await dataSource.getRepository(RequestToRentEntity).findOne({
      where: { id: requestToRentId },
      relations: ['property', 'unit', 'user', 'userDetails'],
    });

    if (!requestToRent) {
      throw new Error('Request to rent not found');
    }

    if (!requestToRent.property || !requestToRent.unit) {
      throw new Error('Property or unit information is missing');
    }

    const lessorInfo = await dataSource.getRepository(LessorInfoEntity).findOne({
      where: { id: requestToRent.property.lessorInfoId },
    });

    if (!lessorInfo) {
      throw new Error('Lessor information not found');
    }

    const data = this.prepareLeaseData(requestToRent, lessorInfo);

    const htmlContent = await this.compileTemplate(data);

    const pdfBuffer = await this.generatePDF(htmlContent);

    return pdfBuffer;
  }

  private prepareLeaseData(
    requestToRent: RequestToRentEntity,
    lessorInfo: LessorInfoEntity
  ): LeaseAgreementData {
    const property = requestToRent.property;
    const unit = requestToRent.unit;

    const formatDate = (date: Date | string): string => {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    return {
      currentDate: formatDate(new Date()),
      property: {
        address: property.address || 'N/A',
        city: property.city || 'N/A',
        state: property.state || 'N/A',
        type: property.type || 'N/A',
        leaseTerm: property.leaseTerm || 'N/A',
        leasePolicy: property.leasePolicy || {},
        utilities: property.utilities || null,
      },
      unit: {
        label: unit.label || 'N/A',
        price: unit.price || 0,
        noOfBedrooms: unit.noOfBedrooms || 0,
        noOfBathrooms: unit.noOfBathrooms || 0,
        squareFeet: unit.squareFeet || undefined,
        dateAvailable: formatDate(unit.dateAvailable),
        paymentSchedule: unit.paymentSchedule || 'MONTHLY',
        hasAgencyFee: unit.hasAgencyFee || false,
        agencyFeePercentage: unit.agencyFeePercentage || undefined,
        fixedAgencyFee: unit.fixedAgencyFee || undefined,
      },
      lessor: {
        firstName: lessorInfo.firstName || 'N/A',
        lastName: lessorInfo.lastName || 'N/A',
        phoneNumber: lessorInfo.phoneNumber || 'N/A',
        email: lessorInfo.email || 'N/A',
        agencyName: lessorInfo.agencyName || undefined,
      },
      tenant: {
        firstName: requestToRent.firstName || 'N/A',
        middleName: requestToRent.middleName || undefined,
        lastName: requestToRent.lastName || 'N/A',
        phoneNumber: requestToRent.phoneNumber || 'N/A',
        email: requestToRent.email || 'N/A',
        currentAddress: requestToRent.currentAddress || 'N/A',
        moveInDate: formatDate(requestToRent.moveInDate),
      },
    };
  }

  private async compileTemplate(data: LeaseAgreementData): Promise<string> {
    const templateContent = await fs.readFile(this.templatePath, 'utf-8');

    const template = handlebars.compile(templateContent);

    const html = template(data);

    return html;
  }

  private async generatePDF(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  async saveLeaseAgreementToS3(
    requestToRentId: string,
    pdfBuffer: Buffer
  ): Promise<string> {
    try {
      const filename = `lease-agreement-${requestToRentId}-${Date.now()}.pdf`;
      const uploadKey = `${process.env.NODE_ENV}/lease-agreements/${filename}`;

      const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      const bucketName = process.env.S3_PUBLIC_BUCKET;

      const params = {
        Bucket: bucketName,
        Key: uploadKey,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        ContentDisposition: 'inline',
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadKey}`;
      
      logger.info(`Lease agreement uploaded successfully to S3: ${s3Url}`);

      return s3Url;
    } catch (error) {
      logger.error('Error uploading lease agreement to S3:', error);
      throw new Error('Failed to upload lease agreement to S3');
    }
  }

  async generateAndSaveLeaseAgreement(requestToRentId: string): Promise<{
    pdfBuffer: Buffer;
    s3Url: string;
  }> {
    const pdfBuffer = await this.generateLeaseAgreement(requestToRentId);
    const s3Url = await this.saveLeaseAgreementToS3(requestToRentId, pdfBuffer);

    // Update the request to rent entity with the lease agreement URL
    await dataSource.getRepository(RequestToRentEntity).update(
      { id: requestToRentId },
      { leaseAgreementUrl: s3Url }
    );

    logger.info(`Lease agreement URL saved to database for request: ${requestToRentId}`);

    return {
      pdfBuffer,
      s3Url,
    };
  }
}
