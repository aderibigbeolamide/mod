# Letbud Backend

## Overview
Letbud is a comprehensive backend API service designed for property rental management. Built with Node.js and Express, it provides functionalities for property listings, user authentication, rental requests, payments, and lease agreement management. The platform aims to streamline the rental process for both landlords and tenants, offering features such as automated email notifications for lease agreements, robust document handling via AWS S3, and a structured API for various property-related operations. The project's ambition is to become a leading solution in the property tech market by offering an efficient, secure, and user-friendly rental ecosystem.

## User Preferences
I want to prioritize iterative development, with a focus on delivering working features quickly. When implementing new features or making significant changes, please ask for my approval before proceeding. I prefer clear and concise explanations of technical decisions. Ensure that all code is well-documented and follows best practices for maintainability and scalability.

## System Architecture

### UI/UX Decisions
The backend supports a robust and intuitive user experience by providing well-structured API endpoints for all frontend interactions. While primarily a backend service, the design facilitates a smooth user journey through features like clear property listings, streamlined rental application processes, and automated notifications.

### Technical Implementations
Letbud is built on Node.js with Express.js for API handling and TypeORM for database interactions with PostgreSQL. Key features include:
- **Authentication**: JWT-based authentication for secure user access.
- **Property Management**: Endpoints for creating, viewing, and managing property listings.
- **Rental Requests**: Workflow for tenants to submit rental applications and for landlords to review and approve them.
- **Lease Agreement Management**:
    - Supports landlord-uploaded lease documents or system-generated templates.
    - Utilizes `pdf-lib` for PDF manipulation, including merging documents and appending signature pages.
    - Employs a "Generate-on-Demand, Save-Once" strategy to optimize S3 storage, where PDFs are generated dynamically for previews and only the final, signed document is saved.
    - Comprehensive signature tracking, including timestamps and IP addresses (stored in database only, not displayed in PDF) for both landlord and tenant.
    - Automated email notifications with attached finalized lease PDFs to both landlords and tenants upon full execution.
    - `propertyMedia.leaseDocumentUrl` serves as the single source of truth for lease documents throughout the signing process.
- **Payment Processing**: Functionality for handling rental payments and tracking transactions.
- **File Storage**: Integration with AWS S3 for secure storage of lease agreements and other media.
- **Communication**: Email notifications via Nodemailer and SMS via Twilio.
- **Logging**: Centralized logging using Winston with daily rotation.

### Feature Specifications
- **API Versioning**: All APIs are versioned under `/api/v1/`.
- **Swagger Documentation**: API documentation is automatically generated and available at `/api-docs`.
- **Validation**: Uses `class-validator` and `class-transformer` for robust data validation.
- **Task Scheduling**: Implemented with `node-cron` and `Bull` for background tasks.

### System Design Choices
- **Microservice-oriented thinking**: While a single service, its modular design allows for potential future decomposition.
- **Database**: PostgreSQL as the primary data store, managed via TypeORM.
- **Scalability**: Designed to handle increasing load through efficient resource management and cloud-based services like AWS S3.
- **Security**: Focus on secure authentication, data validation, and robust error handling.
- **Modular Design**: Lease agreement logic is centralized in `LeaseAgreementService` and integrated into `PropertyService` and `RequestToRentService`, eliminating a standalone lease agreement controller.

## External Dependencies
- **Database**: PostgreSQL (Neon-backed via Replit)
- **Cloud Storage**: AWS S3
- **Email Service**: Nodemailer
- **SMS Service**: Twilio
- **API Documentation**: Swagger (swagger-ui-express, swagger-jsdoc)
- **PDF Manipulation**: `pdf-lib`
- **PDF Generation**: Puppeteer
- **Task Queues**: `Bull`
- **Logging**: `Winston`
- **Validation**: `class-validator`, `class-transformer`
- **Authentication**: `jsonwebtoken` (JWT)
- **File Uploads**: `Multer`
- **Scheduler**: `node-cron`