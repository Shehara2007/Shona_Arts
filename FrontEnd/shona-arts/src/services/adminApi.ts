import { api } from './api';
import type { Artwork } from '../utils/types';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
  blocked: boolean;
  wishlist: unknown[];
  orders: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminStats {
  users: number;
  orders: number;
  artworks: number;
  reviews: number;
  customOrders: number;
  notifications: number;
  revenue: number;
}

export interface AdminOrder {
  _id: string;
  userId: { _id: string; name: string; email: string; role: string; avatar?: string } | string;
  items: Array<{ artwork: Artwork; quantity: number; price: number }>;
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: string;
  totalPrice: number;
  orderStatus: 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
}

export interface AdminReview {
  _id: string;
  userId: { _id: string; name: string; email: string; role: string; avatar?: string } | string;
  artworkId: { _id: string; title: string; image: string; category: string } | string;
  rating: number;
  comment: string;
  images?: string[];
  verifiedPurchase?: boolean;
  createdAt?: string;
}

export interface AdminCustomOrder {
  _id: string;
  userId: { _id: string; name: string; email: string; role: string; avatar?: string } | string;
  referenceImage: string;
  artStyle: string;
  notes: string;
  budget: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  createdAt?: string;
}

export interface AdminNotification {
  _id: string;
  userId: { _id: string; name: string; email: string; role: string; avatar?: string } | string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface AdminAuction {
  _id: string;
  artworkId: Artwork | string;
  startingPrice: number;
  highestBid: number;
  currentWinner?: { _id: string; name: string; email: string } | string;
  endTime: string;
  status: 'draft' | 'live' | 'closed';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  bidHistory: Array<{ userId: string; bidderName?: string; amount: number; createdAt?: string }>;
}

export async function fetchAdminStats() {
  const { data } = await api.get<AdminStats>('/admin/dashboard');
  return data;
}

export async function fetchAdminUsers() {
  const { data } = await api.get<AdminUser[]>('/admin/users');
  return data;
}

export async function updateAdminUser(id: string, payload: Partial<Pick<AdminUser, 'role' | 'blocked'>>) {
  const { data } = await api.patch<AdminUser>(`/admin/users/${id}`, payload);
  return data;
}

export async function deleteAdminUser(id: string) {
  await api.delete(`/admin/users/${id}`);
}

export async function fetchAdminOrders() {
  const { data } = await api.get<AdminOrder[]>('/admin/orders');
  return data;
}

export async function updateAdminOrder(id: string, payload: Partial<Pick<AdminOrder, 'paymentStatus' | 'orderStatus'>>) {
  const { data } = await api.patch<AdminOrder>(`/admin/orders/${id}`, payload);
  return data;
}

export async function fetchAdminReviews() {
  const { data } = await api.get<AdminReview[]>('/admin/reviews');
  return data;
}

export async function deleteAdminReview(id: string) {
  await api.delete(`/admin/reviews/${id}`);
}

export async function fetchAdminCustomOrders() {
  const { data } = await api.get<AdminCustomOrder[]>('/admin/custom-orders');
  return data;
}

export async function updateAdminCustomOrder(id: string, status: AdminCustomOrder['status']) {
  const { data } = await api.patch<AdminCustomOrder>(`/admin/custom-orders/${id}`, { status });
  return data;
}

export async function fetchAdminNotifications() {
  const { data } = await api.get<AdminNotification[]>('/admin/notifications');
  return data;
}

export async function createAdminNotification(payload: { userId: string; title: string; message: string }) {
  const { data } = await api.post<AdminNotification>('/admin/notifications', payload);
  return data;
}

export async function fetchAdminArtworks() {
  const { data } = await api.get<Artwork[] | { data: Artwork[] }>('/paintings?limit=50');
  return Array.isArray(data) ? data : data.data;
}

export async function createAdminArtwork(payload: Partial<Artwork>) {
  const { data } = await api.post<Artwork>('/paintings', payload);
  return data;
}

export async function updateAdminArtwork(id: string, payload: Partial<Artwork>) {
  const { data } = await api.patch<Artwork>(`/paintings/${id}`, payload);
  return data;
}

export async function deleteAdminArtwork(id: string) {
  await api.delete(`/paintings/${id}`);
}

export async function fetchAdminAuctions() {
  const { data } = await api.get<AdminAuction[]>('/auctions');
  return data;
}

export async function createAdminAuction(payload: { artworkId: string; startingPrice: number; highestBid?: number; endTime: string; status: 'draft' | 'live' | 'closed' }) {
  const { data } = await api.post<AdminAuction>('/auctions', payload);
  return data;
}

export async function updateAdminAuction(id: string, payload: Partial<Pick<AdminAuction, 'artworkId' | 'startingPrice' | 'highestBid' | 'endTime' | 'status'>>) {
  const { data } = await api.patch<AdminAuction>(`/auctions/${id}`, payload);
  return data;
}

export async function deleteAdminAuction(id: string) {
  await api.delete(`/auctions/${id}`);
}
