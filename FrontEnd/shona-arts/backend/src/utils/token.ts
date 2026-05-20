import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import type { IUser } from '../models/User.js';

export function signToken(user: IUser) {
  const secret: Secret = process.env.JWT_SECRET ?? 'dev-secret';
  const options: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'] };
  return jwt.sign({ id: user._id, role: user.role }, secret, options);
}
