import express from 'express';
const router = express.Router(); 


// Import controllers
import { getUser, registerUser, loginUser, logoutUser,verifyUser,verifyOtp } from '../controllers/user.controller.js';




// Sample route for user registration
router.post('/auth/register' , registerUser);
router.post('/auth/verify/:token', verifyUser);

router.post('/auth/user', getUser);
router.post('/auth/otp', verifyOtp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);


// Export the router
export default router;