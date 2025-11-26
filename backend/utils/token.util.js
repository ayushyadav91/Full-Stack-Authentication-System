import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';




// Method to generate JWT token (assuming you have a method to generate tokens)
// Access token generation logic
export const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, 
 email: User?.email },
  process.env.JWT_SECRET_ACCESS_TOKEN, {  
        expiresIn: '1h' // Token expiration time
    });
}       
  
//Referesh token generation logic
export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, 

 email: User?.email },
  process.env.JWT_SECRET_REFRESH_TOKEN, {  
        expiresIn: '7d' // Token expiration time
});
}  