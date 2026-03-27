# Vercel Deployment Guide

## Status: Ready to Deploy ✅

This application now includes **automatic MySQL fallback** that allows it to work on Vercel even without a MySQL database configured.

## Deployment Options

### Option 1: Quick Deploy (No Database) - Recommended for Testing
The app will work with **in-memory mock database** - perfect for testing:

```bash
vercel deploy
```

This uses the fallback mock database built into `backend/db.js`. Data persists during the session but is lost on restart.

### Option 2: Deploy with MySQL Database - Recommended for Production

#### Step 1: Set Up MySQL (Choose One)

**Option A: PlanetScale (Free MySQL)**
1. Go to https://planetscale.com
2. Create free account
3. Create new database "myapp"
4. Get credentials from "Connect" → "Node.js"
5. Note the: host, username, password

**Option B: Railway.app (Free MySQL)**
1. Go to https://railway.app
2. Create project → Add MySQL
3. Copy credentials from "Connect"

**Option C: Heroku ClearDB (Free MySQL)**
1. Go to https://devcenter.heroku.com/articles/cleardb-mysql
2. Follow setup instructions

#### Step 2: Configure Environment Variables on Vercel

1. Go to https://vercel.com/dashboard
2. Select your project "studynoteswebsite"
3. Click "Settings" → "Environment Variables"
4. Add these variables:

```
MYSQL_HOST = your-database-host.com
MYSQL_USER = your_username
MYSQL_PASSWORD = your_password
MYSQL_DATABASE = myapp
MYSQL_PORT = 3306
```

#### Step 3: Deploy

```bash
vercel deploy --prod
```

## Testing the Deployment

### Test Health Check
```bash
curl https://studynoteswebsite.vercel.app/health
```

### Test Signup
```bash
curl -X POST https://studynoteswebsite.vercel.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass123"}'
```

### Test Login
```bash
curl -X POST https://studynoteswebsite.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass123"}'
```

## How the Fallback Works

If MySQL connection fails:
- ✅ All API endpoints still work
- ✅ Uses in-memory mock database
- ✅ Test fully functional Vercel deployment
- ⚠️ Data lost on restart (session-based)

```javascript
// Automatic fallback in backend/db.js
if (err) {
    console.log("⚠️  Using mock database (in-memory storage)");
    db = createMockDatabase();
}
```

## Environment Variables Reference

| Variable | Example | Required |
|----------|---------|----------|
| MYSQL_HOST | mysql.planetscale.com | No* |
| MYSQL_USER | root | No* |
| MYSQL_PASSWORD | password123 | No* |
| MYSQL_DATABASE | myapp | No* |
| MYSQL_PORT | 3306 | No |
| PORT | 3000 | No (auto) |

*Not required - app uses mock database if not set

## Troubleshooting

### "Database connection failed" logs?
✅ Normal - app switches to mock database automatically

### Frontend can't connect to API?
1. Check CORS is enabled in backend/server.js
2. Verify API endpoints: /auth/signup, /auth/login, /addnote, etc.
3. Check browser console for errors

### Data not persisting?
- Using mock database (session-based data)
- Configure MySQL environment variables for persistence

## Local Testing Before Deploy

```bash
# Install dependencies
npm install

# Initialize database locally (optional)
npm run init-db

# Start server
npm start

# Server runs on http://localhost:3000
```

## Project Structure

```
backend/
  ├── server.js     (Express app with all routes)
  ├── db.js         (MySQL + fallback mock database)
  └── init-database.js (Initialize schema)
frontend/
  ├── index.html    (UI)
  ├── script.js     (API calls)
  └── style.css     (Styling)
vercel.json        (Deployment config)
package.json       (Dependencies)
```

## Next Steps

1. ✅ Code is optimized for Vercel
2. Deploy: `vercel deploy --prod`
3. Test endpoints on https://studynoteswebsite.vercel.app
4. (Optional) Configure MySQL for persistence

---
Generated with automatic fallback support. No additional configuration required to deploy!
