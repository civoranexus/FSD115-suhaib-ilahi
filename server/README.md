# LiveStockHub Backend - Digital Cattle Marketplace

A comprehensive, production-ready Node.js backend for a digital livestock trading platform. Built with Express.js, PostgreSQL, and Socket.io for real-time bidding and messaging.

## ✨ Features

### Core Functionalities
- **User Management**: Registration, authentication, KYC verification
- **Livestock Listings**: Create, update, search, and manage animal listings
- **Bidding System**: Real-time auction bidding with multiple bid types
- **Transaction Management**: Purchase orders, status tracking, delivery management
- **Payment Processing**: Multiple payment methods, refund handling
- **Messaging**: Real-time buyer-seller communication
- **Notifications**: Real-time notifications for bids, sales, and updates
- **Admin Dashboard**: User management, listing moderation, sales reports

### Technical Features
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Real-time communication via Socket.io
- Comprehensive error handling
- Input validation and sanitization
- Rate limiting and security headers
- Pagination and search filters
- Audit logging
- Docker containerization
- CI/CD ready

## 📋 Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **PostgreSQL**: v13.0 or higher
- **Redis**: v6.0 or higher (optional, for caching)
- **Docker**: v20.0 (optional, for containerization)

## 🚀 Installation

### 1. Clone Repository
    git clone https://github.com/livestockhub/backend.git
    cd livestockhub-backend

### 2. Install Dependencies
    npm install

### 3. Setup Environment Variables
    cp .env.example .env
    
    # Edit .env with your configuration
    nano .env

### 4. Database Setup

#### Option A: Using Docker (Recommended)
    docker-compose up -d

    This will start PostgreSQL, Redis, and Mailhog containers.

#### Option B: Manual Installation
    # Create PostgreSQL database
    createdb livestockhub_db

    # Run migrations
    npm run db:migrate

    # Seed sample data (optional)
    npm run db:seed

### 5. Start the Server

#### Development Mode
    npm run dev

#### Production Mode
    npm start

Server will run on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:


 // "jsonwebtoken": "^9.1.2",
    // "bcryptjs": "^2.4.3",
    // "multer": "^1.4.5-lts.1",
    // "joi": "^17.11.0",
    // "helmet": "^7.1.0",
    // "cors": "^2.8.5",
    // "express-rate-limit": "^7.1.5",
    // "socket.io": "^4.7.2",
    // "redis": "^4.6.12",
    // "nodemailer": "^6.9.7",
    // "winston": "^3.11.0",
    <!-- // "express-async-errors": "^3.1.1", -->
    // "uuid": "^9.0.1",
    // "moment": "^2.29.4",
    // "lodash": "^4.17.21"

       // "nodemon": "^3.0.2",
    // "jest": "^29.7.0",
    // "supertest": "^6.3.3",
    // "eslint": "^8.53.0",
    // "@faker-js/faker": "^8.3.1"