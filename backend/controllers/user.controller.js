import User from '../models/user.model.js'; // Adjust the path as necessary
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file


// Method to generate JWT token (assuming you have a method to generate tokens)
// Access token generation logic
export const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, 
username: User.username,
 email: User?.email },
  process.env.JWT_SECRET_ACCESS_TOKEN, {  
        expiresIn: '1h' // Token expiration time
    });
}       

//Referesh token generation logic
export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, 
username: User.username,
 email: User?.email },
  process.env.JWT_SECRET_REFRESH_TOKEN, {  
        expiresIn: '7d' // Token expiration time
});
}  

const getUser = async (req, res) => {
    try {
        // Assuming you have a user ID in the request (e.g., from a token)
        const userId = req.user.id; // Adjust based on your authentication middleware
        const user = await User.findById(userId);   
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        res.status(200).json({
            id: user._id,
            username: user.username,
        }
        );
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }

};      

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;     
    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
         // If user exists, return error
        if (existingUser) {
            return res.status(400).json({ 
                error: true,
                message: 'User already exists' });
        }       
        //Create new user  
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201)
        .json({
            newUser,
            error: false,
         message: 'User registered successfully' });
    }   
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;   
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
         }   
        // Check password (assuming you have a method to compare passwords)
        const isMatch = await user.comparePassword(password);                                       
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token (assuming you have a method to generate tokens)
         const accessToken = user.generateAccessToken(); // Assuming you have a method to generate tokens in your User model
        // Optionally, you can also generate a refresh token if needed
         const refreshToken = user.generateRefreshToken();
        // Send response with token and user info
                
        
        // res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
        res.status(200).json({
            accessToken,
            refreshToken,
        
            user: { id: user._id, username: user.username, email: user.email },
            message: 'User logged in successfully'
        });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }

};
const logoutUser = (req, res) => {
    try {
        // Clear the refresh token or handle logout logic
        req.user.refreshToken = null; // Assuming you have a refreshToken field in your user model
        req.user.save();
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Server error' });
    }   
};

export { getUser, registerUser, loginUser, logoutUser };

