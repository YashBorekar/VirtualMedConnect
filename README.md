# SmartCare - Virtual Healthcare Platform

A full-stack telemedicine platform that enables secure doctor-patient consultations, AI-powered symptom analysis, and comprehensive health record management.

## Features

- 🏥 **Virtual Consultations**: Video/audio appointments between doctors and patients
- 👨‍⚕️ **Doctor Profiles**: Comprehensive doctor listings with specialties and ratings
- 📋 **Appointment Booking**: Easy scheduling system with calendar integration
- 🤖 **AI Symptom Checker**: Intelligent symptom analysis with recommendations
- 📊 **Health Records**: Secure patient health data management
- 🔐 **Authentication**: Secure login with Replit Auth integration
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
- **Replit Auth** for authentication
- **Zod** for validation

### Database
- **PostgreSQL** (Neon serverless)
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

# Authentication (for production)
REPLIT_DOMAINS=your-domain.com
ISSUER_URL=https://replit.com/oidc
SESSION_SECRET=your-session-secret-key
REPL_ID=your-repl-id

# Development mode (comment out for production)
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

### 1. Vercel (Recommended - Free Tier)

**Why Vercel:**
- Excellent Next.js/React support
- Built-in PostgreSQL (Vercel Postgres)
- Automatic deployments from GitHub
- Free tier: 100GB bandwidth, unlimited personal projects

**Setup:**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

### 2. Railway (Free Tier)

**Why Railway:**
- Full-stack application support
- Built-in PostgreSQL
- GitHub integration
- Free tier: $5 credit monthly

**Setup:**
1. Connect GitHub repository to Railway
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy automatically on push

### 3. Render (Free Tier)

**Why Render:**
- Free tier for static sites and web services
- PostgreSQL hosting available
- GitHub auto-deploy
- SSL certificates included

**Setup:**
1. Create Web Service from GitHub repo
2. Add PostgreSQL database
3. Configure environment variables
4. Set build and start commands

### 4. Heroku (Free Alternative)

**Why Heroku:**
- Easy deployment process
- Add-on ecosystem (Heroku Postgres)
- Git-based deployment

**Setup:**
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret

# Deploy
git push heroku main
```

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
│   └── replitAuth.ts      # Authentication setup
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
- No authentication required
- Local PostgreSQL or development database

### Production
- Requires Replit Auth setup
- Secure session management
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
- Authentication uses secure session management
- Database queries use parameterized statements
- Environment variables for sensitive data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the code comments for implementation details