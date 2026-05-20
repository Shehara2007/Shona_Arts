import { Notification } from '../models/Notification.js';

export async function notifyUser(userId: string, title: string, message: string) {
  return Notification.create({ userId, title, message });
}

export async function sendEmailNotification(to: string, subject: string, message: string) {
  console.log(`Email notification queued for ${to}: ${subject} - ${message}`);
}
