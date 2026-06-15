import { Router } from 'express';
import { adminDashboard, addReview, createAuction, createCustomOrder, createOrder, createPaymentSession, deleteAuction, getAuctions, getMyCustomOrders, getMyOrders, getNotifications, markNotificationRead, payhereNotify, updateAuction } from '../controllers/commerceController.js';
import { authorize, protect } from '../middleware/auth.js';

export const commerceRoutes = Router();

commerceRoutes.post('/orders', protect, createOrder);
commerceRoutes.get('/orders/my', protect, getMyOrders);
commerceRoutes.post('/payments/session', protect, createPaymentSession);
commerceRoutes.post('/payments/notify', payhereNotify);
commerceRoutes.get('/auctions', getAuctions);
commerceRoutes.post('/auctions', protect, authorize('admin'), createAuction);
commerceRoutes.patch('/auctions/:id', protect, authorize('admin'), updateAuction);
commerceRoutes.delete('/auctions/:id', protect, authorize('admin'), deleteAuction);
commerceRoutes.post('/reviews', protect, addReview);
commerceRoutes.post('/custom-orders', protect, createCustomOrder);
commerceRoutes.get('/custom-orders/my', protect, getMyCustomOrders);
commerceRoutes.get('/notifications', protect, getNotifications);
commerceRoutes.patch('/notifications/:id/read', protect, markNotificationRead);
commerceRoutes.get('/admin/dashboard', protect, authorize('admin'), adminDashboard);
