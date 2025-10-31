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

Added three new fields to `RequestToRentEntity`:
- `landlordSignedAt` (timestamp) - When landlord approved the application
- `landlordSignedByIp` (varchar) - IP address of landlord when they approved
- `tenantSignedByIp` (varchar) - IP address of tenant when they signed

#### 🔄 Complete Workflow

1. **Property Creation** (Landlord)
   - Landlord chooses to use LetBud template (`useLetBudTemplate = true`)
   - NO PDF generated or saved yet

2. **Tenant Requests to Rent**
   - Tenant submits rental application
   - Tenant data stored in `RequestToRentEntity`
   - NO PDF generated or saved yet

3. **Preview Lease Agreement** (Both Parties)
   - Landlord/Tenant can preview via `/api/v1/lease-agreement/preview/:requestToRentId`
   - PDF generated dynamically on-the-fly
   - NOT saved to S3 (only returned as buffer)
   - Can preview unlimited times at no storage cost

4. **Landlord Approves Application**
   - Landlord approves tenant via `/api/v1/request-to-rent/review/:requestToRentID?isApprove=true`
   - System captures `landlordSignedAt` and `landlordSignedByIp`
   - Approval email sent to tenant
   - NO PDF saved to S3 yet

5. **Tenant Signs Lease** (NEW ENDPOINT)
   - Tenant signs via `/api/v1/lease-agreement/sign/:requestToRentId`
   - System validates authorization (only tenant who made request can sign)
   - Generates FINAL PDF with all signature information
   - Saves to S3 as `{environment}/lease-agreements/lease-agreement-{requestId}-{timestamp}.pdf`
   - Updates database with `leaseAgreementSigned = true`, `leaseAgreementSignedAt`, `tenantSignedByIp`, and `leaseAgreementUrl`
   - **This is the ONLY place a PDF is saved to S3**

#### 🔒 Security Features

- **Authorization**: Only the tenant who made the request can sign their lease
- **Transaction Safety**: PDF is generated and uploaded BEFORE database is updated (prevents data inconsistency)
- **IP Tracking**: Both landlord and tenant IP addresses are recorded for audit trail
- **Idempotency**: Cannot sign the same lease twice

#### 📁 S3 Storage Optimization

**Before:**
- Multiple PDFs per property (one for each preview/generation)
- Wasted storage for rejected applications
- No clear final version

**After:**
- ONE PDF per approved rental (only when tenant signs)
- Zero storage cost for previews and rejected applications
- Clear final signed version in S3

#### 🔧 Updated API Endpoints

- `GET /api/v1/lease-agreement/preview/:requestToRentId` - Preview lease (no S3 save)
- `GET /api/v1/lease-agreement/generate/:requestToRentId` - Generate lease (no S3 save)
- `POST /api/v1/lease-agreement/sign/:requestToRentId` - Sign lease (saves to S3) ✨ NEW

#### 📄 Lease Agreement Template

Updated template now shows:
- Landlord signature with date and IP address (when available)
- Tenant signature with date and IP address (when available)
- Blank signature lines for preview mode

### October 29, 2025: S3 Integration for Lease Agreements

1. **Added Database Field**: Added `leaseAgreementUrl` field to `RequestToRentEntity` to store the S3 URL of generated lease agreements
2. **Implemented S3 Upload**: Completed the `saveLeaseAgreementToS3` method in `lease-agreement.service.ts` to upload generated PDFs directly to AWS S3
3. **Updated Service Logic**: Modified `generateAndSaveLeaseAgreement` to save the S3 URL to the database after successful upload
4. **Enabled Lease Agreement Routes**: Enabled the LeaseAgreementRoute in `server.ts`

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
