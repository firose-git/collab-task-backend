import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema, updateProfileSchema } from '../utils/validation';
import { AuthRequest } from '../middlewares/authMiddleware';

// Generate JWT and set cookie
const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ errors: validation.error.format() });
    return;
  }

  const { name, email, password } = validation.data;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, passwordHash });

  if (user) {
    generateToken(res, user._id.toString());
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ errors: validation.error.format() });
    return;
  }

  const { email, password } = validation.data;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    generateToken(res, user._id.toString());
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const validation = updateProfileSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ errors: validation.error.format() });
    return;
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  });
});

// @desc Logout user
// @route POST /api/auth/logout
// @access Public
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc Get all users
// @route GET /api/auth/users
// @access Private
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});
