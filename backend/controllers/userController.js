import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

export const registerUser = asyncHandler(
    async (req, res) => {
        const {name, email, password} = req.body;
        //handle validation
        if(!name || !email || !password) {
            res.status(400)
            throw newError('Please fill in all required fields')
        }
        if (password.length < 6) {
            res.status(400)
            throw new Error('password must be up to 6 characters')
        }
        // check if a user exists
        const userExists = await User.findOne({email});
        if (userExists) {
            throw new Error('Email already been registered');
        }
        const user = await User.create({
            name,
            email,
            password
        })
        //generate token 
        const token = generateToken(user._id);
        if(user) {
            res.cookie("token", token, {
                path: '/',
                httpOnly: true,
                expiresIn: new Date(Date.now() + 1000 * 86400),
                secure: true,
                samesite: none
            })
        } else {
            res.status(400)
            throw new Error('Invalid user data')
        }
    });