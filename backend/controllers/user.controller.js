import ApiError from '../utils/api-error.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';
import User from '../models/user.model.js'; 
import jwt from 'jsonwebtoken';
import redisClient from '../db/redisdbConnect.js';
import { sendEmail } from '../utils/sendMail.js';
import sanitize from 'mongo-sanitize';
import crypto from 'crypto';
import { getVerifyEmailHtml } from '../utils/html.js';




// Load environment variables
import dotenv from 'dotenv';


dotenv.config(); 


  
    

/**
 * Register a new user (1 ####) Wrap Controller in Try-Catch + Error Handler Middleware
  1. Input Validation (Strong Validation Layer)
 2. Prevent NoSQL Injection
 3 take user details from req.body
4.Check if User Already Exists (Unique Constraints)
5. Hash Password Properly
6. Store User in DB mean save karo (Minimal Required Fields)
6. Generate JWT With Email Verification Token (Production Requirement)
7. Send Welcome / Verification Email
8. Return Success Response (Consistent API Response Structure)
9. Rate Limiting for Register Endpoint
10. CSRF Not required (for Register API)
11. Logging (But Safe Logging)
12.Atomic Validation of Database Error
13. Error Handling (Centralized Error Handling)
 */


export const registerUser = asyncHandler(async (req, res, next) => {

    // const sanitizedBody = sanitize(req.body);

    // const validation = registerValidationUserSchema.safeParse(sanitizedBody);
    // if (!validation.success) {
    //     return res.status(400).json({ message: validation.error.message });
    // }


    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

     if (existingUser) {
        throw new ApiError(400, "User already exists");
     }

     const rateLimitKey = `register-rate-limit-${req.ip}:${email}`;

     if(await redisClient.get(rateLimitKey)) {
        throw new ApiError(429, "Too many requests, please try again later");
     }

     //verify token
     const verifyToken = crypto.randomBytes(16).toString('hex');
     const verifykey = `verify:${verifyToken}`;

     const dataStore = JSON.stringify({
        email,
        username,
        password,
     });
    await redisClient.set(verifykey, dataStore, { PX: 60000 });

     const subject = 'Verify your email address for Account Creation';
     const html = getVerifyEmailHtml({ email, token: verifyToken });
     await sendEmail({ email, subject, html });

     await redisClient.set(rateLimitKey, "true", { PX: 60000 });

      res.status(201).json({message: 'Please check your email for verification link'});
    
    }); 


export const verifyUser = asyncHandler(async (req, res, next) => {
        const { token } = req.params;
        if (!token) {
            throw new ApiError(400, "verification token is required");
        }

         const verifykey = `verify:${token}`;
         const userDataJson = await redisClient.get(verifykey);
         if (!userDataJson) {
            throw new ApiError(400, "Invalid verification token");
        }
           await redisClient.del(verifykey);
            const userData = JSON.parse(userDataJson);
            
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new ApiError(400, "User already exists");
            }
            
            const user = await User.create({
                username: userData.username,
                email: userData.email,
                password: userData.password,
            });

            res.status(201).json({
                message: 'User registered successfully',
                 user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                    }
            }
            );
     });
       
export const getUser = async (req, res) => {
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

export const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   const rateLimiteKey = `login-rate-limit-${req.ip}:${email}`;
   if(await redisClient.get(rateLimiteKey)) {
       throw new ApiError(429, "Too many requests, please try again later");
   }
   const user = await User.findOne({ email });
   if (!user) {
       throw new ApiError(400, "Invalid email or password");
   }
   const isMatch = await user.comparePassword(password);
   if (!isMatch) {
       throw new ApiError(400, "Invalid email or password");
   }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpkey = `otp:${otp}`;
  await redisClient.set(otpkey, JSON.stringify(otp),{ PX: 600000 });

  const subject = "OTP  for Login";
  await sendEmail ({email, subject, otp});

   await redisClient.set(rateLimiteKey, "true", { PX: 600000 });
   res.status(200).json({
       message: 'OTP sent successfully, Please check your email for OTP,it is valid for 5 min only',
   });
});

export const verifyOtp = asyncHandler(async (req, res) => {
    const {email, otp} = req.body;
    if(!email || !otp) {
        throw new ApiError(400, "Please Provide all the detials");
    }

    const otpkey = `otp:${email}`;
    console.log(otpkey);
    const storedOtpString = await redisClient.set(`otp:${email.toLowerCase()}`, JSON.stringify(otp), { EX: 300 });
    console.log(storedOtpString);

    if(!storedOtpString) {
        throw new ApiError(400, "OTP expired");
    }
    const storedOtp = JSON.parse(storedOtpString);

    if(storedOtp !== String(otp)) {
        throw new ApiError(400, "Invalid OTP");
    }

    await redisClient.del(otpkey);
    let user = await User.findOne({ email});

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const refreshTokenKey = `refresh:${refreshToken}`;
    await redisClient.setEx(refreshTokenKey, 60 * 60 * 24 * 7, refreshToken);

  const options ={
        httpOnly: true,
        //secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
    };
return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                    },
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );

    });
  



export const logoutUser = (req, res) => {
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



