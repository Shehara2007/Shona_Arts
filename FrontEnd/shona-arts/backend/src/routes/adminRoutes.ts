import { Router } from 'express';
import { authorize, protect } from '../middleware/auth.js';
import {
  createNotification,
  deleteReview,
  deleteUser,
  getCustomOrders,
  getDashboardStats,
  getNotifications,
  getOrders,
  getReviews,
  getUsers,
  updateCustomOrder,
  updateOrder,
  updateUser,
} from '../controllers/adminController.js';

export const adminRoutes = Router();

adminRoutes.use(protect, authorize('admin'));

adminRoutes.get('/dashboard', getDashboardStats);
adminRoutes.get('/users', getUsers);
adminRoutes.patch('/users/:id', updateUser);
adminRoutes.delete('/users/:id', deleteUser);
adminRoutes.get('/orders', getOrders);
adminRoutes.patch('/orders/:id', updateOrder);
adminRoutes.get('/reviews', getReviews);
adminRoutes.delete('/reviews/:id', deleteReview);
adminRoutes.get('/custom-orders', getCustomOrders);
adminRoutes.patch('/custom-orders/:id', updateCustomOrder);
adminRoutes.get('/notifications', getNotifications);
adminRoutes.post('/notifications', createNotification);