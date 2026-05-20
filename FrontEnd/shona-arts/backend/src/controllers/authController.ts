import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';
import { User } from '../models/User.js';

const publicUser = (user: { _id: unknown; name: string; email: string; role: string; wishlist: unknown[] }) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  wishlist: user.wishlist,
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  res.status(201).json({ user: publicUser(user), token: signToken(user) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ user: publicUser(user), token: signToken(user) });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const email = `google-${String(req.body.credential).slice(0, 10)}@shonaarts.local`;
  const user = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { name: 'Google Collector', email, password: randomUUID() } },
    { upsert: true, new: true },
  );
  res.json({ user: publicUser(user), token: signToken(user) });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);
  res.json(user);
});
