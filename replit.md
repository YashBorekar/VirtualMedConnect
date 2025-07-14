# MediConnect - Virtual Healthcare Platform

## Overview

MediConnect is a full-stack virtual healthcare platform that enables secure doctor-patient consultations, AI-powered symptom analysis, and comprehensive health record management. The application provides a seamless experience for both patients seeking medical care and doctors providing virtual consultations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful APIs with structured error handling
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Database Architecture
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migration Strategy**: Drizzle Kit for schema migrations

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Roles**: Patient and Doctor role-based access control
- **Security**: HTTPS-only cookies, CSRF protection, secure session handling

### Core Data Models
- **Users**: Base user information with role differentiation
- **Doctors**: Extended profiles with specialties, credentials, and availability
- **Appointments**: Scheduling system with video consultation support
- **Health Records**: Secure patient health data storage
- **Symptom Analysis**: AI-powered symptom assessment records

### User Interface Components
- **Design System**: shadcn/ui components with consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Structure**: Reusable components for appointments, doctor profiles, and health records
- **Navigation**: Role-based navigation with authenticated and public routes

### API Architecture
- **Route Organization**: Centralized route registration in `/server/routes.ts`
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Request Validation**: Zod schema validation for API inputs
- **Middleware**: Authentication middleware, logging, and CORS handling

## Data Flow

### Authentication Flow
1. User initiates login through Replit Auth
2. OpenID Connect verification and token exchange
3. User profile creation or retrieval from database
4. Session establishment with PostgreSQL storage
5. Role-based dashboard redirect

### Appointment Booking Flow
1. Patient searches and selects doctor
2. Available time slot selection
3. Appointment creation with consultation details
4. Doctor notification and confirmation
5. Video consultation link generation

### Symptom Analysis Flow
1. Patient inputs symptoms and demographic data
2. Server-side symptom analysis processing
3. AI-powered assessment generation
4. Results storage and presentation
5. Optional doctor consultation recommendation

## External Dependencies

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection Pooling**: @neondatabase/serverless for efficient connections

### Authentication
- **Replit Auth**: OAuth 2.0/OpenID Connect provider
- **Session Management**: PostgreSQL session store

### Frontend Libraries
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Form Handling**: React Hook Form with Zod validation
- **Date Management**: date-fns for date manipulation
- **Icons**: Lucide React icon library

### Development Tools
- **TypeScript**: Full-stack type safety
- **ESBuild**: Production server bundling
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Development database with migration support

### Production Build
- **Frontend**: Vite static build to `/dist/public`
- **Backend**: ESBuild bundle to `/dist/index.js`
- **Assets**: Static asset serving from build directory

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Authentication**: `REPLIT_DOMAINS`, `ISSUER_URL`, `SESSION_SECRET`
- **Security**: HTTPS-only cookies in production

### Scalability Considerations
- **Database**: Serverless PostgreSQL with connection pooling
- **Session Storage**: PostgreSQL-backed sessions for horizontal scaling
- **Static Assets**: CDN-ready static file serving
- **API**: Stateless API design for load balancer compatibility

The architecture prioritizes security, type safety, and user experience while maintaining scalability for a growing healthcare platform. The modular design allows for easy feature additions and maintenance.