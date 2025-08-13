# Authentication System

A full-stack authentication system built with Node.js, Express, MongoDB, and Mongoose.

## Features

- User registration and login
- Password hashing and security
- JWT-based authentication
- Protected routes
- Environment variable support

## Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayushyadav91/Full-Stack-Authentication-System.git
   cd Full-Stack-Authentication-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. **Run the server:**
   ```bash
   npm start
   ```

## Project Structure

```
backend/
  controllers/
  db/
  routes/
  models/
.env
README.md
```

## API Endpoints

- `POST /api/register` — Register a new user
- `POST /api/login` — Login and receive a JWT
- `GET /api/protected` — Access protected route (JWT required)

## License

This project is licensed under


