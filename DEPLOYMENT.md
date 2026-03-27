# 🚀 StudyHub - Deployment Guide

## Local Development

```bash
npm start
```
Server runs on http://localhost:3000

**Database:** MySQL (localhost, user: root, password: Roots)

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository connected

### Step 1: Add Environment Variables

Go to **Vercel Dashboard** → Select Project → **Settings** → **Environment Variables**

Add these variables:
```
MYSQL_HOST = your-database-host.com
MYSQL_USER = your-username
MYSQL_PASSWORD = your-password
MYSQL_DATABASE = your-database-name
MYSQL_PORT = 3306
```

### Step 2: Deploy

```bash
vercel --prod
```

Or use GitHub auto-deploy (set in Vercel dashboard).

### Recommended Databases

**PlanetScale (FREE - MySQL)**
- Sign up: https://planetscale.com
- Create branch
- Get connection string
- Use in environment variables

**Railway (FREE TIER)**
- Sign up: https://railway.app
- Create MySQL service
- Copy credentials

**Supabase (FREE - PostgreSQL)**
- Sign up: https://supabase.com
- Create project
- Use PostgreSQL connection

## Fallback Mode

If database is unavailable:
- ✅ Server still runs
- ⚠️  API calls return errors gracefully
- Frontend shows error messages

## Health Check

```bash
curl http://localhost:3000/health
```

## Project Structure

```
study_notes_website/
├── backend/
│   ├── server.js        # Express server
│   ├── db.js           # Database config
├── frontend/
│   ├── index.html      # Main page
│   ├── style.css       # Styles
│   ├── script.js       # Frontend logic
│   ├── new.jpg         # Background image
├── database/
│   ├── schema.sql      # Database schema
├── vercel.json         # Vercel config
├── .env.local          # Local environment variables
├── .env.production     # Production template
└── package.json        # Dependencies
```

## Features

- 📝 Create & manage study notes
- 👥 Manage contacts
- 🎓 Track multiple subjects
- 💾 Cloud storage (when DB connected)
- 📱 Responsive design

---

Built with ❤️ for Students
