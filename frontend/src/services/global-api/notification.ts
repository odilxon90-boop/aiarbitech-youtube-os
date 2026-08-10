import { GlobalApiClient } from './client';

export interface NotificationResult {
  id: string;
  [key: string]: unknown;
}

export class GlobalNotificationApi {
  constructor(private readonly client: GlobalApiClient) {}

  sendEmail(to: string, subject: string, body: string): Promise<NotificationResult> {
    return this.client.post<NotificationResult>('/notifications/email', { to, subject, body });
  }

  sendPush(userId: string, title: string, message: string): Promise<NotificationResult> {
    return this.client.post<NotificationResult>('/notifications/push', { userId, title, message });
  }

  sendInApp(userId: string, message: string): Promise<NotificationResult> {
    return this.client.post<NotificationResult>('/notifications/in-app', { userId, message });
  }
}
