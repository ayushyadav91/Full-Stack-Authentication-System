import express from 'express';
const router = express.Router(); 

import {body} from "express-validator"


import { getUser, registerUser, loginUser, logoutUser  } from '../controllers/user.controller.js';

// Import controllers


// Sample route for user registration
router.get('/auth/users',getUser);
router.post('/auth/register' , registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);


// Export the router
export default router;