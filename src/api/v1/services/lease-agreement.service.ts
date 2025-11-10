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
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { logger } from '../../../config/logger.js';
import PropertyService from './property.service.js';
import { PDFDocument } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface LeaseAgreementData {
    currentDate: string;
    logoPath?: string;
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
    signature?: {
        landlordSignedAt?: string;
        landlordSignedByIp?: string;
        tenantSignedAt?: string;
        tenantSignedByIp?: string;
    };
}

export class LeaseAgreementService {
    private async getTemplatePath(): Promise<string> {
        const distTemplatePath = path.join(__dirname, '../templates/lease-agreement.hbs');
        const srcTemplatePath = path.join(__dirname, '../../../../src/api/v1/templates/lease-agreement.hbs');
        
        try {
            await fs.access(distTemplatePath);
            return distTemplatePath;
        } catch {
            logger.warn(`Template not found in dist, falling back to source: ${srcTemplatePath}`);
            return srcTemplatePath;
        }
    }

    public async generateLeaseAgreement(requestToRentId: string): Promise<Buffer> {
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

        const logoAbsolutePath = path.resolve(__dirname, '../../../../resources/uploads/letbudLogo.png');

        const htmlContent = await this.compileTemplate({
            ...await data,
            logoPath: `file://${logoAbsolutePath}`, // ✅ ensures Puppeteer can load it
        });


        const pdfBuffer = await this.generatePDF(htmlContent);

        return pdfBuffer;
    }
    private async prepareLeaseData(
        requestToRent: RequestToRentEntity,
        lessorInfo: LessorInfoEntity,
        includeSignatures: boolean = false
    ): Promise<LeaseAgreementData> {
        // Normalize relations: some ORMs return relations as arrays depending on query shape,
        // so pick the first item when an array is encountered.
        // so pick the first item when an array is encountered.
        const property = Array.isArray(requestToRent.property)
            ? (requestToRent.property[0] as PropertyEntity)
            : (requestToRent.property as PropertyEntity);

        const unit = Array.isArray(requestToRent.unit)
            ? (requestToRent.unit[0] as unknown as PropertyUnitEntity)
            : (requestToRent.unit as unknown as PropertyUnitEntity);

        const formatDate = (date: Date | string): string => {
            if (!date) return 'N/A';
            const d = new Date(date);
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        };

        // Compute total billing using PropertyService
        const billing = await PropertyService.generateBillingAnalytics(
            property.id,
            unit.id
        );

        const leaseData: LeaseAgreementData = {
            currentDate: formatDate(new Date()),
            property: {
                address: property?.address || 'N/A',
                city: property?.city || 'N/A',
                state: property?.state || 'N/A',
                type: property?.type || 'N/A',
                leaseTerm: property?.leaseTerm || 'N/A',
                leasePolicy: property?.leasePolicy || {},
                utilities: property?.utilities || null,
            },
            unit: {
                label: unit?.label || 'N/A',
                price: billing?.total || unit?.price || 0,
                noOfBedrooms: unit?.noOfBedrooms || 0,
                noOfBathrooms: unit?.noOfBathrooms || 0,
                squareFeet: unit?.squareFeet || undefined,
                dateAvailable: formatDate(unit?.dateAvailable),
                paymentSchedule: unit?.paymentSchedule || 'MONTHLY',
                hasAgencyFee: unit?.hasAgencyFee || false,
                agencyFeePercentage: unit?.agencyFeePercentage || undefined,
                fixedAgencyFee: unit?.fixedAgencyFee || undefined,
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

        if (includeSignatures) {
            leaseData.signature = {
                landlordSignedAt: requestToRent.landlordSignedAt 
                    ? formatDate(requestToRent.landlordSignedAt)
                    : undefined,
                landlordSignedByIp: requestToRent.landlordSignedByIp || undefined,
                tenantSignedAt: requestToRent.leaseAgreementSignedAt
                    ? formatDate(requestToRent.leaseAgreementSignedAt)
                    : undefined,
                tenantSignedByIp: requestToRent.tenantSignedByIp || undefined,
            };
        }

        return leaseData;

    }

    private async compileTemplate(data: LeaseAgreementData): Promise<string> {
        const templatePath = await this.getTemplatePath();
        const templateContent = await fs.readFile(templatePath, 'utf-8');

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

            // Convert pdfBuffer to Buffer if it isn't already
            return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
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

        await dataSource.getRepository(RequestToRentEntity).update(
            { id: requestToRentId },
            { leaseAgreementUrl: s3Url } as any
        );

        logger.info(`Lease agreement URL saved to database for request: ${requestToRentId}`);

        return {
            pdfBuffer,
            s3Url,
        };
    }

    async generateFinalSignedLeaseAgreement(requestToRentId: string): Promise<{
        pdfBuffer: Buffer;
        s3Url: string;
    }> {
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

        const data = await this.prepareLeaseData(requestToRent, lessorInfo, true);

        const logoAbsolutePath = path.resolve(__dirname, '../../../../resources/uploads/letbudLogo.png');

        const htmlContent = await this.compileTemplate({
            ...data,
            logoPath: `file://${logoAbsolutePath}`,
        });

        const pdfBuffer = await this.generatePDF(htmlContent);

        const s3Url = await this.saveLeaseAgreementToS3(requestToRentId, pdfBuffer);

        await dataSource.getRepository(RequestToRentEntity).update(
            { id: requestToRentId },
            { leaseAgreementUrl: s3Url } as any
        );

        logger.info(`Final signed lease agreement saved to S3 and database for request: ${requestToRentId}`);

        return {
            pdfBuffer,
            s3Url,
        };
    }

    async generateSignaturePage(
        landlordName: string,
        landlordSignedAt: Date,
        landlordIp: string,
        tenantName: string,
        tenantSignedAt: Date,
        tenantIp: string
    ): Promise<Buffer> {
        const formatDate = (date: Date): string => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        };

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    line-height: 1.6;
                }
                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 40px;
                }
                .signature-section {
                    margin: 30px 0;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .signature-section h2 {
                    color: #555;
                    margin-bottom: 15px;
                }
                .signature-info {
                    margin: 10px 0;
                }
                .label {
                    font-weight: bold;
                    color: #666;
                }
                .value {
                    color: #333;
                }
            </style>
        </head>
        <body>
            <h1>Lease Agreement - Digital Signatures</h1>
            
            <div class="signature-section">
                <h2>Landlord Signature</h2>
                <div class="signature-info">
                    <span class="label">Name:</span>
                    <span class="value">${landlordName}</span>
                </div>
                <div class="signature-info">
                    <span class="label">Signed At:</span>
                    <span class="value">${formatDate(landlordSignedAt)}</span>
                </div>
                <div class="signature-info">
                    <span class="label">IP Address:</span>
                    <span class="value">${landlordIp}</span>
                </div>
            </div>

            <div class="signature-section">
                <h2>Tenant Signature</h2>
                <div class="signature-info">
                    <span class="label">Name:</span>
                    <span class="value">${tenantName}</span>
                </div>
                <div class="signature-info">
                    <span class="label">Signed At:</span>
                    <span class="value">${formatDate(tenantSignedAt)}</span>
                </div>
                <div class="signature-info">
                    <span class="label">IP Address:</span>
                    <span class="value">${tenantIp}</span>
                </div>
            </div>
        </body>
        </html>
        `;

        return await this.generatePDF(htmlContent);
    }

    async mergePDFs(pdf1Buffer: Buffer, pdf2Buffer: Buffer): Promise<Buffer> {
        const pdf1Doc = await PDFDocument.load(pdf1Buffer);
        const pdf2Doc = await PDFDocument.load(pdf2Buffer);

        const mergedPdf = await PDFDocument.create();

        const pages1 = await mergedPdf.copyPages(pdf1Doc, pdf1Doc.getPageIndices());
        pages1.forEach((page) => mergedPdf.addPage(page));

        const pages2 = await mergedPdf.copyPages(pdf2Doc, pdf2Doc.getPageIndices());
        pages2.forEach((page) => mergedPdf.addPage(page));

        const mergedPdfBytes = await mergedPdf.save();
        return Buffer.from(mergedPdfBytes);
    }

    async downloadPDFFromS3(s3Url: string): Promise<Buffer> {
        try {
            const url = new URL(s3Url);
            const bucket = url.hostname.split('.')[0];
            const key = url.pathname.substring(1);

            const s3 = new S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });

            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            const response = await s3.send(command);
            const chunks: Uint8Array[] = [];

            for await (const chunk of response.Body as any) {
                chunks.push(chunk);
            }

            return Buffer.concat(chunks);
        } catch (error) {
            logger.error('Error downloading PDF from S3:', error);
            throw new Error('Failed to download PDF from S3');
        }
    }

    async generatePreviewLeaseDocument(propertyId: string): Promise<string> {
        try {
            const property = await dataSource.getRepository(PropertyEntity).findOne({
                where: { id: propertyId },
                relations: ['units'],
            });

            if (!property) {
                throw new Error('Property not found');
            }

            const unit = property.units?.[0];
            if (!unit) {
                throw new Error('Property has no units');
            }

            const lessorInfo = await dataSource.getRepository(LessorInfoEntity).findOne({
                where: { id: property.lessorInfoId },
            });

            const formatDate = (date: Date | string): string => {
                const d = new Date(date);
                return d.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            };

            const billing = await PropertyService.generateBillingAnalytics(property.id, unit.id);

            const previewData: LeaseAgreementData = {
                currentDate: formatDate(new Date()),
                property: {
                    address: property.address || 'Sample Address',
                    city: property.city || 'Sample City',
                    state: property.state || 'Sample State',
                    type: property.type || 'Residential',
                    leaseTerm: property.leaseTerm || '12 months',
                    leasePolicy: property.leasePolicy || {},
                    utilities: property.utilities || null,
                },
                unit: {
                    label: unit.label || 'Unit 1',
                    price: billing?.total || unit.price || 0,
                    noOfBedrooms: unit.noOfBedrooms || 1,
                    noOfBathrooms: unit.noOfBathrooms || 1,
                    squareFeet: unit.squareFeet || undefined,
                    dateAvailable: formatDate(unit.dateAvailable || new Date()),
                    paymentSchedule: unit.paymentSchedule || 'MONTHLY',
                    hasAgencyFee: unit.hasAgencyFee || false,
                    agencyFeePercentage: unit.agencyFeePercentage || undefined,
                    fixedAgencyFee: unit.fixedAgencyFee || undefined,
                },
                lessor: {
                    firstName: lessorInfo?.firstName || 'Landlord',
                    lastName: lessorInfo?.lastName || 'Name',
                    phoneNumber: lessorInfo?.phoneNumber || '(555) 000-0000',
                    email: lessorInfo?.email || 'landlord@example.com',
                    agencyName: lessorInfo?.agencyName || undefined,
                },
                tenant: {
                    firstName: 'Tenant',
                    middleName: undefined,
                    lastName: 'Name',
                    phoneNumber: '(555) 000-0000',
                    email: 'tenant@example.com',
                    currentAddress: 'Current Address',
                    moveInDate: formatDate(new Date()),
                },
            };

            const logoAbsolutePath = path.resolve(__dirname, '../../../../resources/uploads/letbudLogo.png');

            const htmlContent = await this.compileTemplate({
                ...previewData,
                logoPath: `file://${logoAbsolutePath}`,
            });

            const pdfBuffer = await this.generatePDF(htmlContent);

            const filename = `lease-preview-${propertyId}-${Date.now()}.pdf`;
            const uploadKey = `${process.env.NODE_ENV}/lease-previews/${filename}`;

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

            logger.info(`Preview lease document uploaded successfully to S3: ${s3Url}`);

            return s3Url;
        } catch (error) {
            logger.error('Error generating preview lease document:', error);
            throw new Error('Failed to generate preview lease document');
        }
    }
}
