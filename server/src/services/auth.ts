import type {Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request as ExpressRequest } from 'express';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}
interface CustomRequest extends ExpressRequest {
  user: { _id: unknown; username: string };
}

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';

  if (authHeader) {
    const token = authHeader.split(' ')[1] || '';

    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as JwtPayload;
      return next();
    });
  } else {
    req.user = { _id: null, username: '' }; // Default value to ensure user is always defined
    return next();
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
