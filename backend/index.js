const express = require('express'); 
const app = express();
const connectDB = require('./db/connectdb');

require('dotenv').config(); 
connectDB();

app.use(express.json({
  limit: '50mb'
})); // Middleware to parse JSON requests 

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
// Middleware to parse URL-encoded data

// Middleware to handle CORS    
const cors = require('cors');
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));

// Define a simple route  

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

