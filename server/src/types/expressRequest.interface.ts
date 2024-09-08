import { Request } from 'express';
import { UserDocument } from './user.interface';

/**
 * Extends express' request class for the purpose
 * of adding additional properties.
 */
export interface ExpressRequest extends Request {
  user?: UserDocument;
}
