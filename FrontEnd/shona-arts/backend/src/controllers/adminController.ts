import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Review } from '../models/Review.js';
import { CustomOrder } from '../models/CustomOrder.js';
import { Notification } from '../models/Notification.js';
import { Painting } from '../models/Painting.js';
import { notifyUser } from '../services/notificationService.js';

const allowedRoles = ['customer', 'admin'] as const;
const allowedBlockStates = [true, false] as const;
const allowedOrderStatuses = ['processing', 'packed', 'shipped', 'delivered', 'cancelled'] as const;
const allowedPaymentStatuses = ['pending', 'paid', 'failed'] as const;
const allowedCustomStatuses = ['pending', 'approved', 'in-progress', 'completed', 'rejected'] as const;

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [users, orders, artworks, reviews, customOrders, notifications, paidOrders, paidCustomOrders] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Painting.countDocuments(),
    Review.countDocuments(),
    CustomOrder.countDocuments(),
    Notification.countDocuments(),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    CustomOrder.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$budget' } } }]),
  ]);

  res.json({
    users,
    orders,
    artworks,
    reviews,
    customOrders,
    notifications,
    revenue: (paidOrders[0]?.total ?? 0) + (paidCustomOrders[0]?.total ?? 0),
  });
});

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().sort('-createdAt').select('_id name email avatar role blocked wishlist orders createdAt updatedAt');
  res.json(users);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { role, blocked } = req.body as { role?: (typeof allowedRoles)[number]; blocked?: boolean };
  if (role && !allowedRoles.includes(role)) {
    res.status(400).json({ message: 'Invalid role' });
    return;
  }
  if (blocked !== undefined && !allowedBlockStates.includes(blocked)) {
    res.status(400).json({ message: 'Invalid blocked state' });
    return;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { ...(role ? { role } : {}), ...(blocked !== undefined ? { blocked } : {}) },
    { new: true, runValidators: true },
  ).select(
    '_id name email avatar role blocked wishlist orders createdAt updatedAt',
  );

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('_id role');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  await Promise.all([
    User.findByIdAndDelete(req.params.id),
    Order.deleteMany({ userId: req.params.id }),
    Review.deleteMany({ userId: req.params.id }),
    CustomOrder.deleteMany({ userId: req.params.id }),
    Notification.deleteMany({ userId: req.params.id }),
  ]);

  res.status(204).send();
});

export const getOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await Order.find()
    .populate('userId', 'name email role avatar')
    .populate('items.artwork', 'title image price category')
    .sort('-createdAt');
  res.json(orders);
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const updates: Record<string, unknown> = {};
  const { paymentStatus, orderStatus } = req.body as { paymentStatus?: string; orderStatus?: string };

  if (paymentStatus) {
    if (!allowedPaymentStatuses.includes(paymentStatus as (typeof allowedPaymentStatuses)[number])) {
      res.status(400).json({ message: 'Invalid payment status' });
      return;
    }
    updates.paymentStatus = paymentStatus;
  }

  if (orderStatus) {
    if (!allowedOrderStatuses.includes(orderStatus as (typeof allowedOrderStatuses)[number])) {
      res.status(400).json({ message: 'Invalid order status' });
      return;
    }
    updates.orderStatus = orderStatus;
  }

  const existingOrder = await Order.findById(req.params.id).select('userId paymentStatus orderStatus');
  if (!existingOrder) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    .populate('userId', 'name email role avatar')
    .populate('items.artwork', 'title image price category');

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  if (orderStatus && orderStatus !== existingOrder.orderStatus) {
    await notifyUser(String(existingOrder.userId), 'Order tracking updated', `Your order is now ${orderStatus}.`);
  }
  if (paymentStatus && paymentStatus !== existingOrder.paymentStatus) {
    await notifyUser(String(existingOrder.userId), 'Payment status updated', `Your order payment status is now ${paymentStatus}.`);
  }

  res.json(order);
});

export const getReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await Review.find().populate('userId', 'name email role avatar').populate('artworkId', 'title image category').sort('-createdAt');
  res.json(reviews);
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  await Promise.all([
    Review.findByIdAndDelete(req.params.id),
    Painting.findByIdAndUpdate(review.artworkId, { $pull: { reviews: review._id } }),
  ]);

  res.status(204).send();
});

export const getCustomOrders = asyncHandler(async (_req: Request, res: Response) => {
  const customOrders = await CustomOrder.find().populate('userId', 'name email role avatar').sort('-createdAt');
  res.json(customOrders);
});

export const updateCustomOrder = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status?: string };
  if (status && !allowedCustomStatuses.includes(status as (typeof allowedCustomStatuses)[number])) {
    res.status(400).json({ message: 'Invalid custom order status' });
    return;
  }

  const existingCustomOrder = await CustomOrder.findById(req.params.id).select('userId status');
  if (!existingCustomOrder) {
    res.status(404).json({ message: 'Custom order not found' });
    return;
  }

  const customOrder = await CustomOrder.findByIdAndUpdate(req.params.id, status ? { status } : {}, { new: true, runValidators: true }).populate(
    'userId',
    'name email role avatar',
  );

  if (!customOrder) {
    res.status(404).json({ message: 'Custom order not found' });
    return;
  }

  if (status && status !== existingCustomOrder.status) {
    await notifyUser(String(existingCustomOrder.userId), 'Custom artwork tracking updated', `Your custom artwork request is now ${status}.`);
  }

  res.json(customOrder);
});

export const getNotifications = asyncHandler(async (_req: Request, res: Response) => {
  const notifications = await Notification.find().populate('userId', 'name email role avatar').sort('-createdAt');
  res.json(notifications);
});

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.create(req.body);
  const populated = await notification.populate('userId', 'name email role avatar');
  res.status(201).json(populated);
});
