import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../config';
import { type JwtUserPayload } from '../controllers/users';
import UserModel from '../models/User';
import { ExpressRequest } from '../types';

const authMiddleware = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send();
    }

    const token = authHeader.split(' ')[1];
    const data = jwt.verify(token, secret) as JwtUserPayload;
    const user = await UserModel.findById(data.id);

    if (!user) {
      return res.status(401).send();
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send();
  }
};

export default authMiddleware;
