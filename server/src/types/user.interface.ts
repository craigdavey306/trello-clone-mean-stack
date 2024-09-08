import { Document } from 'mongoose';

/**
 * Defines the expected fields and types for a user.
 */
export interface User {
  /**
   * User's email
   */
  email: string;

  /**
   * Unique user name
   */
  username: string;

  /**
   * User's password
   */
  password: string;

  /**
   * Date that the user object was created.
   */
  createdAt: Date;

  updatedAt: Date;
}

/**
 * MongoDB user document
 */
export interface UserDocument extends User, Document {
  validatePassword: (password: string) => Promise<boolean>;
}
