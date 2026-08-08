import { GlobalApiClient } from './client.js';

export interface WalletBalance {
  userId: string;
  balance: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  [key: string]: unknown;
}

export class GlobalWalletApi {
  constructor(private readonly client: GlobalApiClient) {}

  getBalance(userId: string): Promise<WalletBalance> {
    return this.client.get<WalletBalance>(`/wallets/${encodeURIComponent(userId)}/balance`);
  }

  credit(userId: string, amount: number): Promise<WalletTransaction> {
    return this.client.post<WalletTransaction>(`/wallets/${encodeURIComponent(userId)}/credit`, { amount });
  }

  debit(userId: string, amount: number): Promise<WalletTransaction> {
    return this.client.post<WalletTransaction>(`/wallets/${encodeURIComponent(userId)}/debit`, { amount });
  }

  transfer(fromUserId: string, toUserId: string, amount: number): Promise<WalletTransaction> {
    return this.client.post<WalletTransaction>('/wallets/transfer', { fromUserId, toUserId, amount });
  }
}
