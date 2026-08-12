// Creator Analytics Center service. Mock data only: 30 days of history, 12 videos,
// audience geography, and device breakdown. No real YouTube Analytics integration.

export type AnalyticsMetric = 'subscribers' | 'views' | 'watchTime' | 'ctr' | 'revenue';

export interface TimePoint {
  date: string;
  value: number;
}

export interface MetricSeries {
  metric: AnalyticsMetric;
  label: string;
  points: readonly TimePoint[];
}

export interface MetricSummary {
  metric: AnalyticsMetric;
  label: string;
  value: number;
  delta: number;
  display: string;
}

export interface TopVideo {
  id: string;
  title: string;
  views: number;
  watchTimeHours: number;
  ctr: number;
  revenue: number;
}

export interface RegionBreakdown {
  country: string;
  share: number;
  viewers: number;
}

export interface DeviceBreakdown {
  device: string;
  share: number;
  viewers: number;
}

export interface AnalyticsSummary {
  generatedAt: string;
  metrics: readonly MetricSummary[];
}

export interface AnalyticsTrends {
  generatedAt: string;
  series: readonly MetricSeries[];
}

export interface AnalyticsPerformance {
  generatedAt: string;
  topVideos: readonly TopVideo[];
  geography: readonly RegionBreakdown[];
  devices: readonly DeviceBreakdown[];
}

const LEGACY_OVERVIEW = [
  { dateRange: 'week' as const, channel: 'channel-1', views: [120, 165, 210, 245], retentionPercent: 68, revenue: 420 },
  { dateRange: 'week' as const, channel: 'channel-2', views: [85, 110, 143, 170], retentionPercent: 61, revenue: 280 },
  { dateRange: 'month' as const, channel: 'channel-1', views: [480, 660, 840, 980], retentionPercent: 71, revenue: 1680 },
];

const DAYS = 30;

function dateFor(daysAgo: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function subscribersAt(daysAgo: number): number {
  return 27120 + (DAYS - daysAgo) * 84 + Math.round(Math.sin(daysAgo * 0.9) * 40);
}
function viewsAt(daysAgo: number): number {
  return 4320 + Math.round(1250 * Math.sin(daysAgo * 0.5)) + (DAYS - daysAgo) * 15;
}
function watchTimeAt(daysAgo: number): number {
  return Math.round(viewsAt(daysAgo) * 0.082);
}
function ctrAt(daysAgo: number): number {
  return Number((5.6 + 0.9 * Math.sin(daysAgo * 0.7) + (DAYS - daysAgo) * 0.02).toFixed(2));
}
function revenueAt(daysAgo: number): number {
  return Number((38 + 6 * Math.sin(daysAgo * 0.6) + (DAYS - daysAgo) * 0.5).toFixed(2));
}

const VALUE_AT: Readonly<
  Record<AnalyticsMetric, { label: string; fn: (daysAgo: number) => number }>
> = {
  subscribers: { label: 'Subscribers', fn: subscribersAt },
  views: { label: 'Views', fn: viewsAt },
  watchTime: { label: 'Watch Time (h)', fn: watchTimeAt },
  ctr: { label: 'CTR (%)', fn: ctrAt },
  revenue: { label: 'Revenue ($)', fn: revenueAt },
};

function buildSeries(metric: AnalyticsMetric): MetricSeries {
  const label = VALUE_AT[metric].label;
  const points: TimePoint[] = [];
  for (let daysAgo = DAYS - 1; daysAgo >= 0; daysAgo -= 1) {
    points.push({ date: dateFor(daysAgo), value: VALUE_AT[metric].fn(daysAgo) });
  }
  return { metric, label, points };
}

function sum(values: readonly TimePoint[]): number {
  return values.reduce((total, point) => total + point.value, 0);
}

const nowIso = (): string => new Date().toISOString();

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const subscribers = buildSeries('subscribers');
  const views = buildSeries('views');
  const watchTime = buildSeries('watchTime');
  const ctr = buildSeries('ctr');
  const revenue = buildSeries('revenue');

  const latest = subscribers.points[subscribers.points.length - 1];
  const first = subscribers.points[0];
  const subscriberDelta =
    latest && first && first.value !== 0
      ? Number((((latest.value - first.value) / first.value) * 100).toFixed(1))
      : 0;

  const totalViews = sum(views.points);
  const totalWatchTime = sum(watchTime.points);
  const totalRevenue = sum(revenue.points);
  const averageCtr =
    ctr.points.length === 0 ? 0 : Number((sum(ctr.points) / ctr.points.length).toFixed(2));

  const metrics: MetricSummary[] = [
    { metric: 'subscribers', label: 'Subscribers', value: latest?.value ?? 0, delta: subscriberDelta, display: (latest?.value ?? 0).toLocaleString() },
    { metric: 'views', label: 'Views', value: totalViews, delta: 12.4, display: totalViews.toLocaleString() },
    { metric: 'watchTime', label: 'Watch Time (h)', value: totalWatchTime, delta: 9.6, display: `${totalWatchTime.toLocaleString()}h` },
    { metric: 'ctr', label: 'CTR (%)', value: averageCtr, delta: -0.3, display: `${averageCtr}%` },
    {
      metric: 'revenue',
      label: 'Revenue ($)',
      value: Number(totalRevenue.toFixed(2)),
      delta: 14.2,
      display: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
  ];
  return { generatedAt: nowIso(), metrics };
}

export async function getAnalyticsTrends(): Promise<AnalyticsTrends> {
  const series = (Object.keys(VALUE_AT) as AnalyticsMetric[]).map((metric) =>
    buildSeries(metric),
  );
  return { generatedAt: nowIso(), series };
}

export async function getAnalyticsPerformance(): Promise<AnalyticsPerformance> {
  const topVideos: TopVideo[] = [
    { id: 'v1', title: 'Top 5 AI Automations', views: 48210, watchTimeHours: 12840, ctr: 8.4, revenue: 412.5 },
    { id: 'v2', title: 'Build a YouTube OS in a Day', views: 37120, watchTimeHours: 9940, ctr: 7.9, revenue: 356.8 },
    { id: 'v3', title: 'AI Content Pipeline Explained', views: 29840, watchTimeHours: 8210, ctr: 7.1, revenue: 289.2 },
    { id: 'v4', title: 'Automation Stack Walkthrough', views: 25190, watchTimeHours: 7040, ctr: 6.8, revenue: 240.1 },
    { id: 'v5', title: '5 Mistakes New Creators Make', views: 21460, watchTimeHours: 6110, ctr: 6.5, revenue: 198.4 },
    { id: 'v6', title: 'Monetizing Faceless Channels', views: 18740, watchTimeHours: 5230, ctr: 6.2, revenue: 175.6 },
    { id: 'v7', title: 'YouTube Shorts Growth Tactics', views: 16280, watchTimeHours: 4170, ctr: 6.9, revenue: 140.3 },
    { id: 'v8', title: 'Thumbnail Psychology Crash Course', views: 13910, watchTimeHours: 3560, ctr: 7.6, revenue: 128.9 },
    { id: 'v9', title: 'Batch Editing for Speed', views: 11870, watchTimeHours: 3080, ctr: 5.8, revenue: 102.4 },
    { id: 'v10', title: 'AI Voiceover Tools Compared', views: 9540, watchTimeHours: 2470, ctr: 5.4, revenue: 88.1 },
    { id: 'v11', title: 'Content Calendar in Notion', views: 8120, watchTimeHours: 2040, ctr: 5.1, revenue: 71.2 },
    { id: 'v12', title: 'How I Script for Retention', views: 6890, watchTimeHours: 1790, ctr: 4.9, revenue: 60.7 },
  ];

  const geography: RegionBreakdown[] = [
    { country: 'United States', share: 34, viewers: 44800 },
    { country: 'India', share: 21, viewers: 27700 },
    { country: 'United Kingdom', share: 12, viewers: 15800 },
    { country: 'Germany', share: 9, viewers: 11900 },
    { country: 'Canada', share: 7, viewers: 9200 },
    { country: 'Australia', share: 6, viewers: 7900 },
    { country: 'Brazil', share: 6, viewers: 7900 },
    { country: 'Other', share: 5, viewers: 6600 },
  ];

  const devices: DeviceBreakdown[] = [
    { device: 'Mobile', share: 58, viewers: 76500 },
    { device: 'Desktop', share: 27, viewers: 35600 },
    { device: 'Tablet', share: 9, viewers: 11900 },
    { device: 'TV', share: 6, viewers: 7900 },
  ];

  return { generatedAt: nowIso(), topVideos, geography, devices };
}

export async function getAnalyticsOverview(channel = 'channel-1', range: 'week' | 'month' = 'week') {
  return LEGACY_OVERVIEW.find((item) => item.channel === channel && item.dateRange === range) ?? LEGACY_OVERVIEW[0]!;
}