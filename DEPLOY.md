# Quick Deployment Guide

## 🚀 Best Free Hosting Options (Ranked)

### 1. Vercel + Neon PostgreSQL (Recommended)
**Total Cost: $0/month**
**Best for: React/Node.js apps with PostgreSQL**

#### Setup (5 minutes):
1. **Database**: Go to [neon.tech](https://neon.tech)
   - Sign up free
   - Create database
   - Copy connection string

2. **Hosting**: Go to [vercel.com](https://vercel.com)
   - Import from GitHub
   - Add environment variables:
     ```
     DATABASE_URL=your_neon_connection_string
     NODE_ENV=production
     SESSION_SECRET=your_32_char_secret
     REPLIT_DOMAINS=your-app.vercel.app
     ```
   - Deploy automatically

#### Free Limits:
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth/month
- ✅ PostgreSQL: 512MB storage, 1M rows

---

### 2. Railway (Easiest Setup)
**Total Cost: $0/month (with $5 credit)**
**Best for: Full-stack apps with database**

#### Setup (3 minutes):
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add PostgreSQL service
4. Environment variables are auto-configured
5. Deploy with one click

#### Free Limits:
- ✅ $5 monthly credit (covers small apps)
- ✅ PostgreSQL included
- ✅ Automatic SSL

---

### 3. Render + Supabase
**Total Cost: $0/month**
**Best for: Simple deployment**

#### Setup (7 minutes):
1. **Database**: [supabase.com](https://supabase.com)
   - Create project
   - Get connection string from Settings → Database

2. **Hosting**: [render.com](https://render.com)
   - Create Web Service
   - Connect GitHub
   - Add environment variables
   - Deploy

#### Free Limits:
- ✅ 750 hours/month runtime
- ✅ PostgreSQL: 500MB storage
- ✅ Automatic HTTPS

---

## 📋 Environment Variables Needed

For any hosting platform, you'll need these:

```env
DATABASE_URL=your_postgres_connection_string
NODE_ENV=production
SESSION_SECRET=your_random_32_character_string
REPLIT_DOMAINS=your-app-domain.com
```

## 🔧 Build Configuration

All platforms need these settings:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18.x
- **Output Directory**: `dist/public`

## ⚡ Quick Commands

```bash
# 1. Download from Replit
# 2. Set up locally
npm install
cp .env.example .env
# Edit .env with your database URL
npm run db:push
npm run dev

# 3. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/mediconnect.git
git push -u origin main

# 4. Deploy to your chosen platform (follow links above)
```

## 🐛 Common Deployment Issues

### "Cannot connect to database"
- Check DATABASE_URL format: `postgresql://user:pass@host:port/dbname`
- Ensure database is accessible from hosting platform

### "Build failed"
- Check Node.js version (use 18.x)
- Verify all dependencies are in package.json
- Check build logs for specific errors

### "App crashes on start"
- Verify all environment variables are set
- Check if SESSION_SECRET is at least 32 characters
- Review application logs

## 💰 Cost Comparison

| Platform | Database | Bandwidth | Storage | Monthly Cost |
|----------|----------|-----------|---------|--------------|
| Vercel + Neon | 512MB | 100GB | Unlimited | $0 |
| Railway | 1GB | 100GB | 1GB | $0 ($5 credit) |
| Render + Supabase | 500MB | 100GB | 1GB | $0 |

## 🎯 Recommended Path

1. **Start with Vercel + Neon** for best React performance
2. **Try Railway** if you want the simplest setup
3. **Use Render + Supabase** if others hit limits

All options are free and will handle moderate traffic perfectly!