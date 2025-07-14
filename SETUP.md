# MediConnect Setup Guide

This guide will help you set up the MediConnect telemedicine platform locally in VS Code, push it to GitHub, and deploy it to free hosting services.

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- Git installed
- VS Code installed
- A GitHub account
- PostgreSQL database (local or cloud)

## 🚀 Step-by-Step Setup

### 1. Download Project from Replit

1. In your Replit project, click on the three dots (⋯) menu
2. Select "Download as ZIP"
3. Extract the ZIP file to your desired local directory
4. Rename the folder to `mediconnect` (or your preferred name)

### 2. VS Code Setup

1. **Open the project in VS Code:**
   ```bash
   cd mediconnect
   code .
   ```

2. **Install recommended extensions:**
   - Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Type "Extensions: Show Recommended Extensions"
   - Install all recommended extensions (they're in `.vscode/extensions.json`)

3. **Key extensions to install:**
   - Tailwind CSS IntelliSense
   - Prettier - Code formatter
   - TypeScript and JavaScript
   - Auto Rename Tag
   - Path Intellisense

### 3. Environment Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your `.env` file:**
   ```env
   # For local development
   DATABASE_URL=postgresql://username:password@localhost:5432/mediconnect
   NODE_ENV=development
   
   # For production (add when deploying)
   REPLIT_DOMAINS=your-domain.com
   SESSION_SECRET=your-super-secret-key-at-least-32-characters
   ```

### 4. Database Setup

**Option A: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create a database named `mediconnect`
3. Update DATABASE_URL in `.env`

**Option B: Free Cloud Database (Recommended)**
- **Neon** (free tier): https://neon.tech
- **Supabase** (free tier): https://supabase.com
- **ElephantSQL** (free tier): https://www.elephantsql.com

### 5. Install Dependencies & Start

```bash
# Install all dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Your app will be available at `http://localhost:5000`

## 📤 GitHub Setup

### 1. Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MediConnect telemedicine platform"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com) and click "New Repository"
2. Name it `mediconnect` (or your preferred name)
3. Don't initialize with README (you already have one)
4. Click "Create Repository"

### 3. Push to GitHub

```bash
# Add GitHub remote
git remote add origin https://github.com/yourusername/mediconnect.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Free Hosting Options

### Option 1: Vercel (Recommended)

**Why Vercel:**
- ✅ Best for React applications
- ✅ Free tier: 100GB bandwidth
- ✅ Automatic deployments from GitHub
- ✅ Built-in PostgreSQL (Vercel Postgres)

**Setup Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `mediconnect` repository
5. Configure environment variables:
   ```
   DATABASE_URL=your_postgres_url
   NODE_ENV=production
   SESSION_SECRET=your_secret_key
   REPLIT_DOMAINS=your-app.vercel.app
   ```
6. Deploy!

**Database Setup on Vercel:**
1. Go to Storage tab in your project
2. Create PostgreSQL database
3. Copy connection string to `DATABASE_URL`

### Option 2: Railway

**Why Railway:**
- ✅ Full-stack application support
- ✅ Built-in PostgreSQL
- ✅ $5 monthly credit (free)
- ✅ Simple deployment process

**Setup Steps:**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add PostgreSQL service
6. Configure environment variables
7. Deploy automatically

### Option 3: Render

**Why Render:**
- ✅ Free tier available
- ✅ PostgreSQL hosting
- ✅ GitHub auto-deploy
- ✅ SSL certificates included

**Setup Steps:**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create "Web Service" from GitHub repo
4. Create PostgreSQL database
5. Set environment variables
6. Deploy

### Option 4: Heroku (With Alternatives)

Since Heroku removed free tier, consider these alternatives:
- **Fly.io** - Free allowances for small apps
- **DigitalOcean App Platform** - $5/month
- **Cyclic** - Free tier for Node.js apps

## 🔧 Development Workflow

### Daily Development

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and test:**
   ```bash
   npm run dev
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request on GitHub**

### Database Changes

```bash
# After modifying schema.ts
npm run db:push

# For production migrations
npm run db:generate
npm run db:migrate
```

### Building for Production

```bash
# Build the application
npm run build

# Test production build locally
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot connect to database"**
   - Check DATABASE_URL in `.env`
   - Ensure database is running
   - Verify connection string format

2. **"Module not found" errors**
   - Run `npm install`
   - Check import paths
   - Restart VS Code

3. **Authentication not working**
   - Set NODE_ENV=development for local testing
   - Configure REPLIT_DOMAINS for production

4. **Build failures on deployment**
   - Check build logs
   - Ensure all environment variables are set
   - Verify Node.js version compatibility

### Getting Help

- Check the README.md for detailed documentation
- Review error logs in your hosting platform
- Create issues on your GitHub repository
- Check the console in browser developer tools

## 📊 Monitoring Your App

### Performance Monitoring

- **Vercel**: Built-in analytics
- **Railway**: Metrics dashboard
- **Render**: Application logs and metrics

### Database Monitoring

- **Drizzle Studio**: `npm run db:studio`
- **Hosting platform**: Database metrics in dashboard

## 🔐 Security Checklist

Before going live:

- [ ] Set strong SESSION_SECRET (32+ characters)
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Configure CORS properly
- [ ] Set up environment variables securely
- [ ] Review database permissions
- [ ] Test authentication flows

## 📈 Next Steps

1. **Custom Domain**: Configure custom domain on your hosting platform
2. **SSL Certificate**: Usually automatic on modern platforms
3. **Monitoring**: Set up error tracking (Sentry, LogRocket)
4. **Analytics**: Add user analytics (Google Analytics)
5. **CI/CD**: Set up automated testing and deployment

## 💡 Tips for Success

1. **Start with development mode** to test everything locally
2. **Use environment variables** for all configuration
3. **Test database connection** before deploying
4. **Monitor your free tier limits** on hosting platforms
5. **Keep dependencies updated** regularly
6. **Use Git branches** for features and fixes

## 📞 Support

If you encounter issues:
1. Check the logs in your hosting platform
2. Review the troubleshooting section above
3. Search for similar issues on GitHub
4. Create a detailed issue report with error messages and steps to reproduce

Happy coding! 🚀