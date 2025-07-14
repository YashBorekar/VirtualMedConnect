# MediConnect - Virtual Healthcare Platform

A full-stack telemedicine platform that enables secure doctor-patient consultations, AI-powered symptom analysis, and comprehensive health record management.

## Features

- 🏥 **Virtual Consultations**: Secure video/audio appointments between doctors and patients
- 👨‍⚕️ **Doctor Profiles**: Comprehensive doctor listings with specialties and ratings
- 📋 **Appointment Booking**: Easy scheduling system with calendar integration
- 🤖 **AI Symptom Checker**: Intelligent symptom analysis with recommendations
- 📊 **Health Records**: Secure patient health data management
- 🔐 **Authentication**: Secure JWT-based authentication system
- 📱 **Responsive Design**: Mobile-first design with modern UI components

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query** for server state management
- **Wouter** for routing
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **JWT Authentication** with bcrypt password hashing
- **Zod** for validation

### Database
- **PostgreSQL** (supports any PostgreSQL provider)
- **Drizzle ORM** for type-safe queries
- **Drizzle Kit** for migrations

## Local Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd smartcare
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Development mode
NODE_ENV=development
```

### 4. Database Setup
```bash
# Push schema to database
npm run db:push

# Optional: Generate and run migrations
npm run db:generate
npm run db:migrate
```

### 5. Seed Sample Data
The application includes demo data initialization. Sample doctors and users will be created automatically.

### 6. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Authentication

The application now uses JWT-based authentication instead of Replit Auth:

- Users can register with email/password
- Passwords are securely hashed using bcrypt
- JWT tokens are used for session management
- Tokens are stored in localStorage on the client side

### Default Test Accounts

You can create test accounts through the registration form, or add them directly to your database.

## VS Code Setup

### Recommended Extensions
Install these VS Code extensions for the best development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code Settings
Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Deployment Options

### 1. Vercel + Neon PostgreSQL (Recommended - Free Tier)

**Why Vercel:**
- Excellent React support
- Easy PostgreSQL integration with Neon
- Automatic deployments from GitHub
- Free tier: 100GB bandwidth, unlimited personal projects

**Setup:**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string (32+ characters)
   - `NODE_ENV`: production
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

### 2. Railway + PostgreSQL (Free Tier)

**Why Railway:**
- Full-stack application support
- Built-in PostgreSQL
- GitHub integration
- Free tier: $5 credit monthly

**Setup:**
1. Connect GitHub repository to Railway
2. Add PostgreSQL service
3. Configure environment variables:
   - `DATABASE_URL`: Auto-configured by Railway
   - `JWT_SECRET`: Add manually
   - `NODE_ENV`: production
4. Deploy automatically on push

### 3. Render + Supabase (Free Tier)

**Why Render:**
- Free tier for static sites and web services
- Easy integration with Supabase PostgreSQL
- GitHub auto-deploy
- SSL certificates included

**Setup:**
1. Create Web Service from GitHub repo
2. Create Supabase project for PostgreSQL
3. Configure environment variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: production
4. Set build and start commands

## Project Structure

```
mediconnect/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   ├── auth.ts            # JWT authentication
│   └── authRoutes.ts      # Authentication routes
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migration files
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Environment Configuration

### Development
- Uses demo users for testing
- JWT authentication with registration/login
- Local PostgreSQL or development database

### Production
- JWT-based authentication
- Secure password hashing with bcrypt
- Production PostgreSQL database

## Database Schema

The application uses the following main entities:

- **Users**: Authentication and basic user information
- **Doctors**: Extended profiles for medical professionals
- **Appointments**: Consultation scheduling and management
- **Health Records**: Patient medical history
- **Symptom Analyses**: AI-powered symptom assessment results

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All API endpoints are properly validated
- JWT-based authentication with secure token handling
- Password hashing using bcrypt
- Database queries use parameterized statements
- Environment variables for sensitive data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the code comments for implementation details