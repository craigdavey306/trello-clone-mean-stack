import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Error } from 'mongoose';
import UserModel from '../models/User';
import { ExpressRequest, UserDocument } from '../types';
import { secret } from '../config';

type NormalizedUser = Pick<UserDocument, 'id' | 'email' | 'username'> & {
  token: string;
};

export type JwtUserPayload = { id: string; email: string };

/**
 * Normalizes the user document for API responses.
 * @param user {UserDocument} User document
 * @returns A normalized user object
 */
const normalizeUser = (user: UserDocument): NormalizedUser => {
  const token = jwt.sign({ id: user.id, email: user.email }, secret);
  return {
    email: user.email,
    username: user.username,
    // same as user._id
    id: user.id,
    token: `Bearer ${token}`,
  };
};

/**
 * Logic for registering a new user.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    const savedUser = await newUser.save();
    res.send(normalizeUser(savedUser));
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((error) => error.message);
      // unprocessable content - example missing username on user object
      return res.status(422).json(messages);
    }
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Include the password here to validate the user's input
    const user = await UserModel.findOne({ email: req.body.email }).select(
      '+password'
    );
    const errors = { emailOrPassword: 'Incorrect email or password' };

    if (!user) {
      return res.status(422).json(errors);
    }

    const isMatch = await user.validatePassword(req.body.password);

    if (!isMatch) {
      return res.status(422).json(errors);
    }

    res.send(normalizeUser(user));
  } catch (err) {
    next(err);
  }
};

export const currentUser = (req: ExpressRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).send();
  }

  res.send(normalizeUser(req.user));
};
