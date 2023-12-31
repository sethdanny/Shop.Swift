import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const registerUser = asyncHandler(
  async (req, res) => {
    const { name, email, password } = req.body;
    // handle validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error('password must be up to 6 characters');
    }
    // check if a user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('Email already been registered');
    }
    const user = await User.create({
      name,
      email,
      password
    });
    // generate token
    const token = generateToken(user._id);
    if (user) {
      const { _id, name, email, role } = user;
      res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        expiresIn: new Date(Date.now() + 1000 * 86400)
        // secure: true,
        // samesite: none
      });
      res.status(201).json({
        _id,
        name,
        email,
        role,
        token
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('please add email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (user && passwordIsCorrect) {
    const token = generateToken(user._id);
    const newUser = await User.findOne({ email }).select('-password');

    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expiresIn: new Date(Date.now() + 1000 * 86400)
      // secure: true,
      // samesite: none
    });
    res.status(201).json(newUser);
  } else {
    res.status(401);
    throw new Error('Invalid Email or password');
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({
    message: 'Successfully logged Out'
  });
});

export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400);
        throw new Error('User not found');
    }
});