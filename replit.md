# Letbud Backend

## Overview
Letbud is a backend API service built with Node.js, Express, and TypeORM. It provides a comprehensive API for property rental management, including authentication, property listings, rental requests, payments, and more.

## Current State
- **Status**: Running successfully on port 5000
- **Environment**: Development
- **Database**: PostgreSQL (provisioned via Replit)
- **API Version**: 1.0.0
- **Documentation**: Available at `/api-docs` (Swagger UI)

## Recent Changes (October 29, 2025)

### Implemented S3 Integration for Lease Agreements
1. **Added Database Field**: Added `leaseAgreementUrl` field to `RequestToRentEntity` to store the S3 URL of generated lease agreements
2. **Implemented S3 Upload**: Completed the `saveLeaseAgreementToS3` method in `lease-agreement.service.ts` to upload generated PDFs directly to AWS S3
3. **Updated Service Logic**: Modified `generateAndSaveLeaseAgreement` to save the S3 URL to the database after successful upload
4. **Enabled Lease Agreement Routes**: Uncommented and enabled the LeaseAgreementRoute in `server.ts`
5. **Updated Controller**: Fixed the controller to handle the new return type with `s3Url` instead of `filename`

**How it works:**
- When a property owner chooses to use the Letbud lease agreement (when `useLetBudTemplate = true` in PropertyMediaEntity)
- The system generates a PDF from the Handlebars template using property, unit, lessor, and tenant data
- The PDF is automatically uploaded to the S3 bucket at `{environment}/lease-agreements/lease-agreement-{requestId}-{timestamp}.pdf`
- The S3 URL is saved to the `leaseAgreementUrl` field in the request-to-rent record
- The PDF can be downloaded via `/api/v1/lease-agreement/generate/:requestToRentId` or previewed via `/api/v1/lease-agreement/preview/:requestToRentId`

### Fixed Server Startup Issues
1. **Installed Missing Dependencies**: Ran `npm install` to install all required packages including `nodemon` and other devDependencies
2. **Provisioned Database**: Created PostgreSQL database and configured environment variables (DATABASE_URL, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)
3. **Fixed Circular Dependencies**: Resolved TypeORM entity circular dependency issues by using string literals instead of class references in entity decorators:
   - Modified `src/api/v1/entities/request-to-rent.entity.ts` to use string-based entity references
   - Modified `src/api/v1/entities/user.entity.ts` to use string-based entity references
   - Removed direct entity class imports to prevent "Cannot access 'UserEntity' before initialization" error

## Project Architecture

### Technology Stack
- **Runtime**: Node.js 20.19.3
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL (Neon-backed via Replit)
- **Documentation**: Swagger (swagger-ui-express + swagger-jsdoc)
- **Validation**: class-validator, class-transformer
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Task Scheduling**: node-cron, Bull
- **Cloud Storage**: AWS S3
- **Email**: Nodemailer
- **SMS**: Twilio
- **Logging**: Winston with daily rotate file

### API Endpoints
The API is organized under `/api/v1/` with the following main routes:
- **Auth**: User authentication (sign-in, sign-up, password reset)
- **OTP**: One-time password management
- **Properties**: Property listings and management
- **Lessors**: Property owner management
- **Request to Rent**: Rental application management
- **Wishlist**: User property favorites
- **Waitlist**: User waitlist management
- **Contact Requests**: Contact form submissions
- **Report Property**: Property reporting functionality
- **Tour Requests**: Property tour scheduling
- **Payments**: Payment processing
- **Payment Transactions**: Payment transaction history
- **Media**: File upload and management
- **KVP**: Key-value pair storage
- **Location**: Location services
- **Verify**: Verification services
- **Request Call**: Call request management
- **Listed Elsewhere**: External listing management

## Environment Variables
The following environment variables are configured:
- `DATABASE_URL`: PostgreSQL connection string
- `PGHOST`: PostgreSQL host
- `PGPORT`: PostgreSQL port (5432)
- `PGUSER`: PostgreSQL username
- `PGPASSWORD`: PostgreSQL password
- `PGDATABASE`: PostgreSQL database name
- `PORT`: Server port (5000)
- `NODE_ENV`: Environment mode (development)

## Development

### Running the Server
```bash
npm run dev
```
This starts the server with nodemon for automatic reloading on file changes.

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

## Known Issues
- SSL connection warning in development mode (expected and safe for local development)
- Using deprecated `assert` in import statements for location.service.ts (V8 warning, not critical)

## Notes
- The server listens on 0.0.0.0:5000 to allow external connections
- CORS is configured for multiple origins including localhost and production domains
- Logging is configured with daily rotation, storing logs in `/logs/debug/` and `/logs/error/`
- TypeORM migrations run automatically on server startup
- Scheduler runs hourly for request call batch processing
