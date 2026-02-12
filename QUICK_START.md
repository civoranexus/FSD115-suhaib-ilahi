# Quick Start Guide - Civora Project

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- npm or yarn

## Environment Setup

✅ Environment files have been created:

- `server/.env` - Backend configuration
- `client/.env` - Frontend configuration

## Starting the Backend

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Set up database (requires PostgreSQL running)
npm run db:migrate
npm run db:seed

# 4. Start development server
npm run dev

# 5. Verify server is running
curl http://localhost:3000/health
```

**Expected output:**

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-02-02T..."
}
```

## Starting the Frontend

```bash
# 1. Navigate to client directory
cd client

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

## Database Configuration

The backend expects these environment variables (already set in `.env`):

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=livestockhub_db
DB_USER=postgres
DB_PASSWORD=postgres
```

Create the database:

```bash
createdb -U postgres livestockhub_db
```

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

Examples:

- Health Check: `GET http://localhost:3000/health`
- Auth Login: `POST http://localhost:3000/api/v1/auth/login`
- List Listings: `GET http://localhost:3000/api/v1/listings`

## Troubleshooting

### Backend won't start

- Ensure PostgreSQL is running
- Check database credentials in `server/.env`
- Check port 3000 is not in use

### Frontend can't connect to backend

- Verify backend is running on port 3000
- Check `client/.env` has correct `VITE_API_BASE_URL=http://localhost:3000/api/v1`
- Check browser console for CORS errors

### Database migration fails

- Ensure PostgreSQL is installed and running
- Verify database credentials are correct
- Check `/server/database/migrations/init.js` exists

## Project Structure

```
Civora/
├── server/           # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/   # Database models
│   │   ├── services/ # Business logic
│   │   ├── routes/   # API routes
│   │   └── config/   # Configuration
│   └── .env          # Environment variables
│
└── client/           # Frontend (React + Vite)
    ├── src/
    │   ├── pages/    # Page components
    │   ├── components/ # Reusable components
    │   ├── services/ # API service calls
    │   └── redux/    # State management
    └── .env          # Environment variables
```

## Key Features Configured

✅ PostgreSQL database connection
✅ JWT authentication
✅ Redis caching
✅ Email notifications (SMTP)
✅ Socket.io for real-time updates
✅ CORS enabled for localhost
✅ Rate limiting
✅ Error handling
✅ Logging

## All Bugs Fixed

- ✅ Database query syntax unified to pg package standard
- ✅ Removed debug console statements
- ✅ Created proper environment configuration files
- ✅ Fixed API port configuration (3000, not 5000)
- ✅ All models verified and working

**The project is now fully functional and ready for development!**
