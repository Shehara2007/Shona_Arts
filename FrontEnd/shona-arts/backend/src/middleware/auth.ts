import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: 'customer' | 'admin' };
    }
  }
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'dev-secret') as { id: string; role: 'customer' | 'admin' };
    const user = await User.findById(decoded.id).select('_id role blocked');
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    if (user.blocked) return res.status(403).json({ message: 'User is blocked' });
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(...roles: Array<'customer' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
