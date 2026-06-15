import { api } from './api';
import type { CartItem, CustomOrder, Notification, Order, PayhereSession, User } from '../utils/types';

export async function fetchMe() {
  const { data } = await api.get<User>('/auth/me');
  return data;
}

export async function updateMe(payload: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) {
  const { data } = await api.patch<User>('/auth/me', payload);
  return data;
}

export async function fetchMyOrders() {
  const { data } = await api.get<Order[]>('/orders/my');
  return data;
}

export async function fetchMyCustomOrders() {
  const { data } = await api.get<CustomOrder[]>('/custom-orders/my');
  return data;
}

export async function createOrder(payload: { items: CartItem[]; shippingAddress: string; totalPrice: number }) {
  const { data } = await api.post<Order>('/orders', {
    shippingAddress: payload.shippingAddress,
    totalPrice: payload.totalPrice,
    items: payload.items.map((item) => ({
      artwork: item.artwork._id,
      quantity: item.quantity,
      price: item.artwork.price,
    })),
  });
  return data;
}

export async function createCustomOrder(payload: Pick<CustomOrder, 'referenceImage' | 'artStyle' | 'notes' | 'budget'>) {
  const { data } = await api.post<CustomOrder>('/custom-orders', payload);
  return data;
}

export async function createPaymentSession(payload: { orderId?: string; customOrderId?: string; auctionId?: string }) {
  const { data } = await api.post<PayhereSession>('/payments/session', payload);
  return data;
}

export function submitPayhereSession(session: PayhereSession) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = session.action_url;

  Object.entries(session).forEach(([key, value]) => {
    if (key === 'action_url' || value === undefined || value === '') return;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export async function fetchNotifications() {
  const { data } = await api.get<Notification[]>('/notifications');
  return data;
}

export async function markNotificationRead(id: string) {
  const { data } = await api.patch<Notification>(`/notifications/${id}/read`);
  return data;
}

export async function fetchRecommendations(params?: { artworkId?: string; style?: string }) {
  const search = new URLSearchParams();
  if (params?.artworkId) search.set('artworkId', params.artworkId);
  if (params?.style) search.set('style', params.style);
  const { data } = await api.get(`/paintings/recommendations/ai${search.size ? `?${search.toString()}` : ''}`);
  return data;
}
