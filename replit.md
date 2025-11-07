# Letbud Backend

## Overview
Letbud is a backend API service built with Node.js, Express, and TypeORM. It provides a comprehensive API for property rental management, including authentication, property listings, rental requests, payments, and more.

## Current State
- **Status**: Running successfully on port 5000
- **Environment**: Development
- **Database**: PostgreSQL (provisioned via Replit)
- **API Version**: 1.0.0
- **Documentation**: Available at `/api-docs` (Swagger UI)

## Recent Changes

### November 7, 2025: Lease Agreement Refactoring

Refactored lease agreement functionality to consolidate all operations through property and request-to-rent endpoints, eliminating separate lease agreement controller and routes.

#### 🎯 Key Changes

**Architecture Simplification:**
- Removed dedicated `lease-agreement.controller.ts` and `lease-agreement.route.ts`
- All lease agreement operations now accessible through existing property and request-to-rent endpoints
- Centralized lease logic in `LeaseAgreementService` used by `PropertyService` and `RequestToRentService`

**Dual Document Type Support:**
- **Landlord-Uploaded Documents**: When landlord uploads their own lease document (`useLetBudTemplate = false`), system respects and uses that document
- **LetBud Template**: When landlord chooses LetBud template (`useLetBudTemplate = true`), system generates comprehensive lease agreement

**PDF Manipulation:**
- Added `pdf-lib` package for PDF merging capabilities
- New `generateSignaturePage()` method creates signature page with landlord and tenant details
- New `mergePDFs()` method combines landlord-uploaded documents with signature pages
- New `downloadPDFFromS3()` helper to retrieve existing PDFs from S3

**Enhanced Signature Handling:**
- Signature page includes both landlord and tenant information:
  - Landlord: Name (from LessorInfo), Signed Date (landlordSignedAt), IP Address (landlordSignedByIp)
  - Tenant: Name (from RequestToRent), Signed Date (leaseAgreementSignedAt), IP Address (tenantSignedByIp)
- For LetBud templates: Signatures embedded in the generated PDF
- For uploaded documents: Signature page appended to landlord's original document

#### 🔄 Updated Workflow

1. **Property Creation** (Landlord)
   - Landlord either uploads their own lease document OR chooses to use LetBud template
   - `PropertyMedia.useLetBudTemplate` flag set accordingly
   - `PropertyMedia.leaseDocumentUrl` contains URL if landlord uploaded their own document

2. **Tenant Requests to Rent**
   - Tenant submits rental application
   - Tenant data stored in `RequestToRentEntity`
   - No lease PDF generated yet

3. **Landlord Approves Application**
   - Landlord approves tenant via `PUT /api/v1/request-to-rent/review/:requestToRentID?isApprove=true`
   - System captures `landlordSignedAt` and `landlordSignedByIp`
   - If `useLetBudTemplate = true`: Generates LetBud template PDF and saves to S3
   - If `useLetBudTemplate = false`: Retains landlord's uploaded document URL
   - Approval email sent to tenant

4. **Tenant Signs Lease**
   - Tenant signs via `POST /api/v1/property/signLeaseAgreement` with `{ unitId }`
   - System validates authorization (only tenant who made request can sign)
   - If `useLetBudTemplate = true`: Regenerates LetBud template with signature section included
   - If `useLetBudTemplate = false`: Downloads landlord's PDF, generates signature page, merges both PDFs, uploads combined PDF to S3
   - Updates database with `leaseAgreementSigned = true`, `leaseAgreementSignedAt`, `tenantSignedByIp`, and final `leaseAgreementUrl`

#### 📋 API Endpoints

All lease agreement functionality now accessible through existing endpoints:

- `POST /api/v1/property/finalize/:propertyID` - Finalize property creation with lease document upload or template selection
- `PUT /api/v1/request-to-rent/review/:requestToRentID` - Approve rental request (captures landlord signature)
- `POST /api/v1/property/signLeaseAgreement` - Tenant signs lease agreement (captures tenant signature)

#### 📦 New Dependencies

- `pdf-lib` - For PDF manipulation and merging capabilities

### October 31, 2025: Lease Agreement "Generate-on-Demand, Save-Once" Strategy

Implemented a comprehensive lease agreement management system with signature tracking and optimized S3 storage.

#### 🎯 Core Improvements

**Problem Solved:** 
- Previous implementation created a new PDF in S3 every time the lease was generated
- Multiple tenants requesting to rent would generate multiple PDFs (wasted storage)
- Only one tenant is approved, making other PDFs useless
- No signature tracking or audit trail

**Solution Implemented:**
- **Generate-on-Demand**: PDFs are generated dynamically for previews without saving to S3
- **Save-Once**: Only ONE final PDF is saved to S3 when tenant signs the lease
- **Signature Tracking**: Complete audit trail with dates and IP addresses for both landlord and tenant

#### 📋 Database Changes

Added signature tracking fields to `RequestToRentEntity`:
- `landlordSignedAt` (timestamp) - When landlord approved the application
- `landlordSignedByIp` (varchar) - IP address of landlord when they approved
- `tenantSignedByIp` (varchar) - IP address of tenant when they signed
- `leaseAgreementUrl` (varchar) - S3 URL of final signed lease agreement

### October 29, 2025: S3 Integration for Lease Agreements

1. **Added Database Field**: Added `leaseAgreementUrl` field to `RequestToRentEntity` to store the S3 URL of generated lease agreements
2. **Implemented S3 Upload**: Completed the `saveLeaseAgreementToS3` method in `lease-agreement.service.ts` to upload generated PDFs directly to AWS S3
3. **Updated Service Logic**: Modified `generateAndSaveLeaseAgreement` to save the S3 URL to the database after successful upload

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
- **PDF Generation**: Puppeteer (for HTML to PDF conversion)
- **PDF Manipulation**: pdf-lib (for PDF merging and signature page appending)

### API Endpoints
The API is organized under `/api/v1/` with the following main routes:
- **Auth**: User authentication (sign-in, sign-up, password reset)
- **OTP**: One-time password management
- **Properties**: Property listings and management (includes lease agreement signing)
- **Lessors**: Property owner management
- **Request to Rent**: Rental application management (includes approval with landlord signature)
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

### Lease Agreement Flow
1. **Property Posting**: Landlord uploads their own lease document or chooses LetBud template
2. **Request to Rent**: Tenant submits application for specific unit
3. **Approval**: Landlord approves request (captures landlord signature: name, date, IP)
4. **Signing**: Tenant signs lease (captures tenant signature: name, date, IP)
5. **Final Document**: 
   - LetBud template: Generated PDF with embedded signatures
   - Uploaded document: Original document + appended signature page

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
- `AWS_REGION`: AWS S3 region
- `AWS_ACCESS_KEY_ID`: AWS access key for S3
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for S3
- `S3_PUBLIC_BUCKET`: S3 bucket name for public assets

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
- Lease agreements are stored in S3 under `{environment}/lease-agreements/` directory
- Signature tracking provides complete audit trail for legal compliance
