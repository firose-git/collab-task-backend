import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as JwtPayload;
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }
    next();
  } catch (err) {
    console.error('JWT Verify Error:', err);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});
