import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import { successResponse } from '../contracts/api.js';
import { PlatformError } from '../shared/errors.js';

interface AnalyticsSnapshot {
  dateRange: 'week' | 'month';
  channel: string;
  views: number[];
  retentionPercent: number;
  revenue: number;
}

const analyticsSnapshots: readonly AnalyticsSnapshot[] = [
  { dateRange: 'week', channel: 'channel-1', views: [120, 165, 210, 245], retentionPercent: 68, revenue: 420 },
  { dateRange: 'week', channel: 'channel-2', views: [85, 110, 143, 170], retentionPercent: 61, revenue: 280 },
  { dateRange: 'month', channel: 'channel-1', views: [480, 660, 840, 980], retentionPercent: 71, revenue: 1_680 },
];

export function registerJourneyRoutes(app: FastifyInstance): void {
  app.get('/api/v1/health', async (request) => successResponse({ status: 'ALIVE' }, request.correlationId));
  app.get<{ Querystring: { dateRange?: 'week' | 'month'; range?: 'week' | 'month'; channel?: string } }>('/api/v1/analytics/overview', async (request) => {
    requirePermission(request, 'analytics:access');
    const dateRange = request.query.dateRange ?? request.query.range;
    const snapshots = analyticsSnapshots.filter((snapshot) =>
      (!dateRange || snapshot.dateRange === dateRange) &&
      (!request.query.channel || snapshot.channel === request.query.channel),
    );
    const data = snapshots[0];
    if (!data) {
      throw new PlatformError(404, 'ANALYTICS_DATA_NOT_FOUND', 'No analytics data matches the selected filters.');
    }
    return successResponse(data, request.correlationId);
  });
}
