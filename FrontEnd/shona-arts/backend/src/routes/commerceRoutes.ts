import { Router } from 'express';
import { adminDashboard, addReview, createAuction, createCustomOrder, createOrder, createPaymentSession, getAuctions, getMyOrders, getNotifications, markNotificationRead, payhereNotify } from '../controllers/commerceController.js';
import { authorize, protect } from '../middleware/auth.js';

export const commerceRoutes = Router();

commerceRoutes.post('/orders', protect, createOrder);
commerceRoutes.get('/orders/my', protect, getMyOrders);
commerceRoutes.post('/payments/session', protect, createPaymentSession);
commerceRoutes.post('/payments/notify', payhereNotify);
commerceRoutes.get('/auctions', getAuctions);
commerceRoutes.post('/auctions', protect, authorize('admin'), createAuction);
commerceRoutes.post('/reviews', protect, addReview);
commerceRoutes.post('/custom-orders', protect, createCustomOrder);
commerceRoutes.get('/notifications', protect, getNotifications);
commerceRoutes.patch('/notifications/:id/read', protect, markNotificationRead);
commerceRoutes.get('/admin/dashboard', protect, authorize('admin'), adminDashboard);
