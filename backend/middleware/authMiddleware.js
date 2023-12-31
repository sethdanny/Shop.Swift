import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(403);
            throw new Error('Authorization failed: Token missing');
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //get user id from token
        const user = await User.findById(verified.id).select('-password');

        if (!user) {
            res.status(404)
            throw new Error('Authorization failed: User not found');
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(403);
        next(error);
    }
});


export default protect;