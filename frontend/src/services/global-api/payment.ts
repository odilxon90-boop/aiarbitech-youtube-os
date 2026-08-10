import { GlobalApiClient } from './client';

export interface Payment {
  id: string;
  [key: string]: unknown;
}

export class GlobalPaymentApi {
  constructor(private readonly client: GlobalApiClient) {}

  createPayment(userId: string, amount: number, currency: string, method: string): Promise<Payment> {
    return this.client.post<Payment>('/payments', { userId, amount, currency, method });
  }

  getPayment(paymentId: string): Promise<Payment> {
    return this.client.get<Payment>(`/payments/${encodeURIComponent(paymentId)}`);
  }

  refundPayment(paymentId: string): Promise<Payment> {
    return this.client.post<Payment>(`/payments/${encodeURIComponent(paymentId)}/refund`);
  }
}
