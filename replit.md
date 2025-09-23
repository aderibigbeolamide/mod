# Letbud Backend - Replit Setup

## Project Overview
This is a Node.js TypeScript backend application for a property rental platform called "Letbud". The application provides REST APIs for property management, user authentication, payment processing, and various property-related services.

## Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT-based authentication
- **Payment Integration**: Monnify payment gateway
- **File Storage**: AWS S3 integration
- **Documentation**: Swagger/OpenAPI integration
- **Email**: Nodemailer integration
- **SMS**: Twilio integration

## Current Setup Status
- ✅ Dependencies installed and TypeScript compilation working
- ✅ PostgreSQL database connected using Replit's built-in database
- ✅ Database migrations successfully applied
- ✅ CORS configured for Replit environment (allowing all origins for development)
- ✅ Backend server configured to run on port 3000 (localhost)
- ✅ Workflow configured for development server
- ✅ Deployment settings configured for VM deployment

## Environment Configuration
The application uses environment variables for configuration. Key variables:
- Database connection uses Replit's built-in PostgreSQL (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)
- Server runs on port 3000 (configured to avoid conflicts with frontend on port 5000)
- NODE_ENV set to development
- CORS configured to allow all origins for Replit development environment

## API Endpoints
- Base API path: `/api/v1/`
- Swagger documentation: `/api-docs`
- Health check and various property, user, and payment endpoints

## Development Notes
- Database migrations are automatically run on server startup
- TypeScript is transpiled using ts-node with ES modules
- The server includes extensive logging for debugging
- All major functionality including property management, user authentication, payment processing, and communication services are implemented

## Deployment
- Configured for VM deployment (maintains server state)
- Build process: `npm run build` (TypeScript compilation)
- Start command: `npm start` (runs migrations and starts server)
- Suitable for production deployment on Replit

## Recent Changes (2025-09-23)
- Configured database connection to use Replit's PostgreSQL environment variables
- Updated CORS to allow all origins for Replit proxy compatibility
- Set backend port to 3000 to avoid conflicts with frontend
- Successfully applied all database migrations
- Configured deployment settings for production readiness