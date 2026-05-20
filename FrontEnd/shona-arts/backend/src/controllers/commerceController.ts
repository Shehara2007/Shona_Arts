import crypto from 'crypto';
import type { Request, Response } from 'express';
import { Auction } from '../models/Auction.js';
import { CustomOrder } from '../models/CustomOrder.js';
import { Order } from '../models/Order.js';
import { Painting } from '../models/Painting.js';
import { Review } from '../models/Review.js';
import { Notification } from '../models/Notification.js';
import { notifyUser } from '../services/notificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.create({ ...req.body, userId: req.user?.id, paymentStatus: 'pending' });
  if (req.user?.id) await notifyUser(req.user.id, 'Order created', 'Your artwork order is waiting for payment confirmation.');
  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.user?.id }).populate('items.artwork').sort('-createdAt');
  res.json(orders);
});

export const createPaymentSession = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, amount, currency = 'LKR' } = req.body;
  const merchantId = process.env.PAYHERE_MERCHANT_ID ?? '';
  const secret = process.env.PAYHERE_MERCHANT_SECRET ?? '';
  const hash = crypto
    .createHash('md5')
    .update(`${merchantId}${orderId}${amount}${currency}${crypto.createHash('md5').update(secret).digest('hex').toUpperCase()}`)
    .digest('hex')
    .toUpperCase();

  res.json({
    sandbox: true,
    merchant_id: merchantId,
    return_url: `${process.env.CLIENT_URL}/orders`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    notify_url: process.env.PAYHERE_NOTIFY_URL,
    order_id: orderId,
    amount,
    currency,
    hash,
  });
});

export const payhereNotify = asyncHandler(async (req: Request, res: Response) => {
  await Order.findByIdAndUpdate(req.body.order_id, { paymentStatus: req.body.status_code === '2' ? 'paid' : 'failed' });
  res.sendStatus(200);
});

export const getAuctions = asyncHandler(async (_req: Request, res: Response) => {
  const auctions = await Auction.find().populate('artworkId').sort('-createdAt');
  res.json(auctions);
});

export const createAuction = asyncHandler(async (req: Request, res: Response) => {
  const auction = await Auction.create(req.body);
  res.status(201).json(auction);
});

export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.create({ ...req.body, userId: req.user?.id });
  await Painting.findByIdAndUpdate(req.body.artworkId, { $push: { reviews: review._id }, $inc: { popularity: 2 } });
  res.status(201).json(review);
});

export const createCustomOrder = asyncHandler(async (req: Request, res: Response) => {
  const customOrder = await CustomOrder.create({ ...req.body, userId: req.user?.id });
  if (req.user?.id) await notifyUser(req.user.id, 'Custom request received', 'Our studio will review your custom artwork request.');
  res.status(201).json(customOrder);
});

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find({ userId: req.user?.id }).sort('-createdAt').limit(30);
  res.json(notifications);
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user?.id }, { isRead: true }, { new: true });
  res.json(notification);
});

export const adminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const [orders, artworks, auctions, customOrders] = await Promise.all([
    Order.countDocuments(),
    Painting.countDocuments(),
    Auction.countDocuments(),
    CustomOrder.countDocuments(),
  ]);
  res.json({ orders, artworks, auctions, customOrders });
});
