# Planora Backend

A Node.js Express backend for the Planora application - a wellness and task management platform.

## Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
├── .env             # Environment variables
├── package.json     # Dependencies
└── server.js        # Entry point
```

## Features

- **Authentication** - User login and registration
- **Task Management** - Create, read, update, delete tasks
- **Wellness Tracking** - Log and track wellness metrics
- **Reports** - Generate wellness and task reports

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with required environment variables:
```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

3. Start the server:
```bash
npm start
```

## API Endpoints

- **Auth** - `/api/auth` - Register, login, logout
- **Tasks** - `/api/tasks` - Task CRUD operations
- **Wellness** - `/api/wellness` - Wellness logging and tracking
- **Reports** - `/api/reports` - Generate reports

## Technologies

- Node.js
- Express.js
- MongoDB/Mongoose (or your chosen database)
- JWT for authentication
