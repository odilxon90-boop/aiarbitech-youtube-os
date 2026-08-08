import { describe, expect, it, vi } from 'vitest';
import { GlobalAuditApi } from '../services/global-api/audit';
import { GlobalAuthApi } from '../services/global-api/auth';
import { GlobalApiClient, GlobalApiError } from '../services/global-api/client';
import { GlobalNotificationApi } from '../services/global-api/notification';
import { GlobalPaymentApi } from '../services/global-api/payment';
import { GlobalWalletApi } from '../services/global-api/wallet';

function createFetch(response: unknown = { id: 'result' }): typeof fetch {
  return vi.fn(async () => new Response(JSON.stringify(response), { status: 200 }));
}

function requestDetails(fetchImpl: typeof fetch): { url: string; init: RequestInit } {
  const mock = vi.mocked(fetchImpl);
  const [url, init] = mock.mock.calls.at(-1) ?? [];
  return { url: String(url), init: init ?? {} };
}

describe('Global API frontend client', () => {
  it('sends API key and bearer token headers through request()', async () => {
    const fetchImpl = createFetch({ ok: true });
    const client = new GlobalApiClient({
      baseURL: 'https://api.ecosystem.aiarbitech.com/',
      apiKey: 'api-key',
      token: 'access-token',
      fetchImpl,
    });

    await expect(client.request<{ ok: boolean }>('PUT', '/profile', { name: 'Ada' })).resolves.toEqual({ ok: true });
    const { url, init } = requestDetails(fetchImpl);
    expect(url).toBe('https://api.ecosystem.aiarbitech.com/profile');
    expect(init).toMatchObject({
      method: 'PUT',
      headers: { 'X-API-Key': 'api-key', Authorization: 'Bearer access-token' },
      body: '{"name":"Ada"}',
    });
  });

  it('surfaces API response errors', async () => {
    const client = new GlobalApiClient({
      baseURL: 'https://api.test',
      apiKey: 'key',
      fetchImpl: vi.fn(async () => new Response('', { status: 401 })),
    });

    await expect(client.delete('/protected')).rejects.toBeInstanceOf(GlobalApiError);
  });

  it('maps all identity service operations', async () => {
    const fetchImpl = createFetch({ accessToken: 'access', refreshToken: 'refresh' });
    const api = new GlobalAuthApi(new GlobalApiClient({ baseURL: 'https://api.test', apiKey: 'key', fetchImpl }));

    await api.login('user@example.com', 'password');
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/identity/auth/login' });
    await api.refreshToken('refresh');
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/identity/auth/refresh' });
    await api.logout('refresh');
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/identity/auth/logout' });
    await api.getCurrentUser();
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/identity/me', init: { method: 'GET' } });
  });

  it('maps all wallet service operations', async () => {
    const fetchImpl = createFetch();
    const api = new GlobalWalletApi(new GlobalApiClient({ baseURL: 'https://api.test', apiKey: 'key', fetchImpl }));

    await api.getBalance('user 1');
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/wallets/user%201/balance' });
    await api.credit('user-1', 10);
    expect(requestDetails(fetchImpl).init.body).toBe('{"amount":10}');
    await api.debit('user-1', 5);
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/wallets/user-1/debit' });
    await api.transfer('from', 'to', 3);
    expect(requestDetails(fetchImpl).init.body).toBe('{"fromUserId":"from","toUserId":"to","amount":3}');
  });

  it('maps all payment service operations', async () => {
    const fetchImpl = createFetch();
    const api = new GlobalPaymentApi(new GlobalApiClient({ baseURL: 'https://api.test', apiKey: 'key', fetchImpl }));

    await api.createPayment('user-1', 12, 'USD', 'card');
    expect(requestDetails(fetchImpl).init.body).toBe('{"userId":"user-1","amount":12,"currency":"USD","method":"card"}');
    await api.getPayment('payment/1');
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/payments/payment%2F1' });
    await api.refundPayment('payment-1');
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/payments/payment-1/refund' });
  });

  it('maps all notification service operations', async () => {
    const fetchImpl = createFetch();
    const api = new GlobalNotificationApi(
      new GlobalApiClient({ baseURL: 'https://api.test', apiKey: 'key', fetchImpl }),
    );

    await api.sendEmail('to@example.com', 'Subject', 'Body');
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/notifications/email' });
    await api.sendPush('user-1', 'Title', 'Message');
    expect(requestDetails(fetchImpl).init.body).toBe('{"userId":"user-1","title":"Title","message":"Message"}');
    await api.sendInApp('user-1', 'Message');
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/notifications/in-app' });
  });

  it('maps all audit service operations', async () => {
    const fetchImpl = createFetch();
    const api = new GlobalAuditApi(new GlobalApiClient({ baseURL: 'https://api.test', apiKey: 'key', fetchImpl }));

    await api.log('user-1', 'READ', 'video', 'video-1');
    expect(requestDetails(fetchImpl).init.body).toBe('{"userId":"user-1","action":"READ","resource":"video","resourceId":"video-1"}');
    await api.getLogs('user 1', 'video item');
    expect(requestDetails(fetchImpl)).toMatchObject({
      url: 'https://api.test/audit/logs?userId=user+1&resource=video+item',
    });
    await api.exportLogs('user-1', 'csv');
    expect(requestDetails(fetchImpl)).toMatchObject({ url: 'https://api.test/audit/logs/export?userId=user-1&format=csv' });
  });
});
