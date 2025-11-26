import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connectdb.js';
// import ExpressMongoSanitize from 'express-mongo-sanitize';
import redisClient from './db/redisdbConnect.js';


import  logger  from './logs/logger.server.js'

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json({
    limit: '16kb'
}));  
app.use(express.urlencoded({
    limit: '16kb',
    extended: true 
}));

// app.use(ExpressMongoSanitize({
//     replaceWith: '_'
// }));


// Connect to MongoDB
connectDB();
// Connect to Redis
redisClient.connect().then(() => {
    console.log('Connected to Redis');
    logger.info('Connected to Redis');
}).catch((err) => {
    console.error('Redis connection error:', err);
    logger.error(`Redis connection error: ${err.message}`);
});

// Import routes
import authRoutes from './routes/auth.routes.js';   
app.use('/api/v1', authRoutes); // Use the auth routes

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Authentication API');
}); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    logger.info(`Server is running on port ${PORT}`);
});





export default app; // Export the app for testing purposes
