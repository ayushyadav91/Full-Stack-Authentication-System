
//check user is authenticated or not

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET_ACCESS_TOKEN;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded;
            next();
        } else {
            res.status(401).json({ message: 'No token provided' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

