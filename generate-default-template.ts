import { LeaseAgreementService } from './src/api/v1/services/lease-agreement.service.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateDefaultTemplate() {
    try {
        console.log('Generating default LetBud lease template...');

        const templatePath = path.join(__dirname, 'src/api/v1/templates/lease-agreement.hbs');
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const template = handlebars.compile(templateContent);

        const formatDate = (date: Date): string => {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        };

        const defaultData = {
            currentDate: formatDate(new Date()),
            property: {
                address: '123 Main Street',
                city: 'Sample City',
                state: 'State',
                type: 'Residential Apartment',
                leaseTerm: '12 months',
                leasePolicy: {
                    allowPets: false,
                    smokingAllowed: false,
                },
                utilities: [
                    { name: 'Water' },
                    { name: 'Electricity' },
                ],
            },
            unit: {
                label: 'Unit 1A',
                price: 500000,
                noOfBedrooms: 2,
                noOfBathrooms: 2,
                squareFeet: 1200,
                dateAvailable: formatDate(new Date()),
                paymentSchedule: 'MONTHLY',
                hasAgencyFee: false,
            },
            lessor: {
                firstName: 'Landlord',
                lastName: 'Name',
                phoneNumber: '(000) 000-0000',
                email: 'landlord@letbud.com',
            },
            tenant: {
                firstName: 'Tenant',
                lastName: 'Name',
                phoneNumber: '(000) 000-0000',
                email: 'tenant@letbud.com',
                currentAddress: '[Tenant Current Address]',
                moveInDate: formatDate(new Date()),
            },
        };

        const logoAbsolutePath = path.resolve(__dirname, 'resources/uploads/letbudLogo.png');
        
        const html = template({
            ...defaultData,
            logoPath: `file://${logoAbsolutePath}`,
        });

        console.log('Generating PDF...');
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
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

        await browser.close();

        console.log('Uploading to S3...');
        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        const bucketName = process.env.S3_PUBLIC_BUCKET!;
        const s3Key = `${process.env.NODE_ENV}/lease-templates/letbud-default-lease-template.pdf`;

        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
            ContentDisposition: 'inline',
        }));

        const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        
        console.log('\n✅ Success!');
        console.log('📄 Default LetBud Lease Template Generated');
        console.log('🔗 URL:', s3Url);
        console.log('\nYou can use this URL in your frontend to display the template.');
        
        return s3Url;
    } catch (error) {
        console.error('Error generating template:', error);
        throw error;
    }
}

generateDefaultTemplate()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
