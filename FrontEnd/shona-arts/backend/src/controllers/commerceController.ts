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

const payhereOrderId = (type: 'order' | 'custom-order' | 'auction', id: string) => {
  if (type === 'order') return `ORDER-${id}`;
  if (type === 'custom-order') return `CUSTOM-${id}`;
  return `AUCTION-${id}`;
};

const buildPayhereSession = async ({
  type,
  id,
  amount,
  user,
  items,
  returnPath,
  cancelPath,
}: {
  type: 'order' | 'custom-order' | 'auction';
  id: string;
  amount: number;
  user: { name?: string; email?: string } | undefined;
  items: string;
  returnPath: string;
  cancelPath: string;
}) => {
  const merchantId = process.env.PAYHERE_MERCHANT_ID ?? '';
  const secret = process.env.PAYHERE_MERCHANT_SECRET ?? '';
  const currency = 'LKR';
  const formattedAmount = amount.toFixed(2);
  const orderId = payhereOrderId(type, id);
  const hashedSecret = crypto.createHash('md5').update(secret).digest('hex').toUpperCase();
  const hash = crypto
    .createHash('md5')
    .update(`${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`)
    .digest('hex')
    .toUpperCase();
  const [firstName, ...rest] = (user?.name || 'Shona Customer').split(' ');

  return {
    sandbox: true,
    action_url: 'https://sandbox.payhere.lk/pay/checkout',
    merchant_id: merchantId,
    return_url: `${process.env.CLIENT_URL}${returnPath}`,
    cancel_url: `${process.env.CLIENT_URL}${cancelPath}`,
    notify_url: process.env.PAYHERE_NOTIFY_URL,
    order_id: orderId,
    items,
    amount: formattedAmount,
    currency,
    first_name: firstName,
    last_name: rest.join(' ') || 'Customer',
    email: user?.email || 'customer@shonaarts.local',
    phone: '0770000000',
    address: 'Shona Arts',
    city: 'Colombo',
    country: 'Sri Lanka',
    hash,
  };
};

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.create({ ...req.body, userId: req.user?.id, paymentStatus: 'pending' });
  order.payhereOrderId = payhereOrderId('order', String(order._id));
  await order.save();
  if (req.user?.id) await notifyUser(req.user.id, 'Order created', 'Your artwork order is waiting for payment confirmation.');
  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.user?.id }).populate('items.artwork').sort('-createdAt');
  res.json(orders);
});

export const createPaymentSession = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, customOrderId, auctionId } = req.body as { orderId?: string; customOrderId?: string; auctionId?: string };

  if (orderId) {
    const order = await Order.findOne({ _id: orderId, userId: req.user?.id }).populate('userId', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const session = await buildPayhereSession({
      type: 'order',
      id: String(order._id),
      amount: order.totalPrice,
      user: order.userId as unknown as { name?: string; email?: string },
      items: `Shona Arts order ${String(order._id).slice(-6).toUpperCase()}`,
      returnPath: '/orders',
      cancelPath: '/cart',
    });
    order.payhereOrderId = session.order_id;
    await order.save();
    res.json(session);
    return;
  }

  if (customOrderId) {
    const customOrder = await CustomOrder.findOne({ _id: customOrderId, userId: req.user?.id }).populate('userId', 'name email');
    if (!customOrder) return res.status(404).json({ message: 'Custom order not found' });
    const session = await buildPayhereSession({
      type: 'custom-order',
      id: String(customOrder._id),
      amount: customOrder.budget,
      user: customOrder.userId as unknown as { name?: string; email?: string },
      items: `Custom artwork ${customOrder.artStyle}`,
      returnPath: '/account/orders',
      cancelPath: '/custom-order',
    });
    customOrder.payhereOrderId = session.order_id;
    await customOrder.save();
    res.json(session);
    return;
  }

  if (auctionId) {
    const auction = await Auction.findById(auctionId).populate('artworkId').populate('currentWinner', 'name email');
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.status !== 'closed' && auction.endTime > new Date()) {
      return res.status(400).json({ message: 'Auction is still live' });
    }
    if (String(auction.currentWinner?._id || auction.currentWinner) !== req.user?.id) {
      return res.status(403).json({ message: 'Only the highest bidder can pay for this auction' });
    }

    auction.status = 'closed';
    auction.winner = auction.currentWinner;
    const artwork = auction.artworkId as unknown as { title?: string };
    const session = await buildPayhereSession({
      type: 'auction',
      id: String(auction._id),
      amount: auction.highestBid,
      user: auction.currentWinner as unknown as { name?: string; email?: string },
      items: `Auction lot ${artwork.title || String(auction._id).slice(-6).toUpperCase()}`,
      returnPath: '/auctions',
      cancelPath: '/auctions',
    });
    auction.payhereOrderId = session.order_id;
    await auction.save();
    res.json(session);
    return;
  }

  res.status(400).json({ message: 'orderId, customOrderId, or auctionId is required' });
});

export const payhereNotify = asyncHandler(async (req: Request, res: Response) => {
  const orderId = String(req.body.order_id || '');
  const paymentStatus = req.body.status_code === '2' ? 'paid' : 'failed';
  if (orderId.startsWith('CUSTOM-')) {
    await CustomOrder.findByIdAndUpdate(orderId.replace('CUSTOM-', ''), { paymentStatus });
  } else if (orderId.startsWith('AUCTION-')) {
    await Auction.findByIdAndUpdate(orderId.replace('AUCTION-', ''), { paymentStatus });
  } else {
    await Order.findByIdAndUpdate(orderId.replace('ORDER-', ''), { paymentStatus });
  }
  res.sendStatus(200);
});

export const getAuctions = asyncHandler(async (_req: Request, res: Response) => {
  const expiredAuctions = await Auction.find({ status: 'live', endTime: { $lte: new Date() } });
  await Promise.all(expiredAuctions.map((auction) => Auction.findByIdAndUpdate(auction._id, { status: 'closed', winner: auction.currentWinner })));
  const auctions = await Auction.find()
    .populate('artworkId')
    .populate('currentWinner', 'name email')
    .populate('winner', 'name email')
    .sort('-createdAt');
  res.json(auctions);
});

export const createAuction = asyncHandler(async (req: Request, res: Response) => {
  const auction = await Auction.create(req.body);
  res.status(201).json(auction);
});

export const updateAuction = asyncHandler(async (req: Request, res: Response) => {
  const allowed = ['artworkId', 'startingPrice', 'highestBid', 'endTime', 'status'] as const;
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key as (typeof allowed)[number])));
  const auction = await Auction.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('artworkId');
  if (!auction) return res.status(404).json({ message: 'Auction not found' });
  res.json(auction);
});

export const deleteAuction = asyncHandler(async (req: Request, res: Response) => {
  await Auction.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.create({ ...req.body, userId: req.user?.id });
  await Painting.findByIdAndUpdate(req.body.artworkId, { $push: { reviews: review._id }, $inc: { popularity: 2 } });
  res.status(201).json(review);
});

export const createCustomOrder = asyncHandler(async (req: Request, res: Response) => {
  const customOrder = await CustomOrder.create({ ...req.body, userId: req.user?.id, paymentStatus: 'pending' });
  customOrder.payhereOrderId = payhereOrderId('custom-order', String(customOrder._id));
  await customOrder.save();
  if (req.user?.id) await notifyUser(req.user.id, 'Custom request received', 'Our studio will review your custom artwork request.');
  res.status(201).json(customOrder);
});

export const getMyCustomOrders = asyncHandler(async (req: Request, res: Response) => {
  const customOrders = await CustomOrder.find({ userId: req.user?.id }).sort('-createdAt');
  res.json(customOrders);
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
