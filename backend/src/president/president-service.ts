export type HealthState = 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
export type AiState = 'ACTIVE' | 'IDLE' | 'ERROR';
export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PresidentHealthMetric { id: string; name: string; status: HealthState; message: string; }
export interface PresidentRevenue { total: number; monthly: number; trend: number; currency: string; trendPoints: number[]; }
export interface PresidentChannel { id: string; title: string; subscribers: string; growth: number; monetized: boolean; }
export interface PresidentAiStatus { id: string; name: string; state: AiState; lastActive: string; message: string; }
export interface PresidentRisk { id: string; severity: RiskSeverity; title: string; description: string; category: string; }
export interface PresidentDashboard {
  health: PresidentHealthMetric[];
  revenue: PresidentRevenue;
  channels: PresidentChannel[];
  aiStatus: PresidentAiStatus[];
  risks: PresidentRisk[];
}

export class PresidentService {
  health(): PresidentHealthMetric[] {
    return [
      { id: 'health-api', name: 'API', status: 'HEALTHY', message: 'All public platform services are responding normally.' },
      { id: 'health-database', name: 'Database', status: 'HEALTHY', message: 'Connection pool and replica lag are within target.' },
      { id: 'health-ai', name: 'AI Core', status: 'DEGRADED', message: 'Model queue is elevated; requests continue to be processed.' },
      { id: 'health-youtube', name: 'YouTube', status: 'CRITICAL', message: 'Publishing connector needs executive review before the next release.' },
    ];
  }

  revenue(): PresidentRevenue {
    return { total: 184_200, monthly: 28_450, trend: 12, currency: 'USD', trendPoints: [19_000, 21_400, 23_100, 25_400, 28_450] };
  }

  channels(): PresidentChannel[] {
    return Array.from({ length: 10 }, (_, index) => ({
      id: `channel-${index + 1}`,
      title: `Creator Channel ${index + 1}`,
      subscribers: (120_000 - index * 8_500).toLocaleString('en-US'),
      monetized: index < 8,
      growth: 4 + (index % 6),
    }));
  }

  aiStatus(): PresidentAiStatus[] {
    return ['Content planning', 'Script review', 'Quality scoring', 'Audience analysis', 'Monetization advice'].map((name, index) => ({
      id: `ai-${index + 1}`,
      name,
      state: index === 3 ? 'IDLE' : index === 4 ? 'ERROR' : 'ACTIVE',
      lastActive: `2026-08-13T${String(12 - index).padStart(2, '0')}:00:00.000Z`,
      message: index === 4 ? 'Mock connector requires a scheduled retry.' : `Mock ${name.toLowerCase()} service.`,
    }));
  }

  risks(): PresidentRisk[] {
    return [
      { id: 'risk-1', severity: 'HIGH', title: 'Security review due', description: 'Complete the scheduled executive access review.', category: 'Security' },
      { id: 'risk-2', severity: 'HIGH', title: 'Revenue concentration', description: 'A limited channel group accounts for most monthly revenue.', category: 'Monetization' },
      { id: 'risk-3', severity: 'MEDIUM', title: 'Copyright review', description: 'Review assets waiting for rights confirmation.', category: 'Compliance' },
      { id: 'risk-4', severity: 'MEDIUM', title: 'Channel compliance', description: 'One creator channel needs a policy acknowledgement.', category: 'Compliance' },
      { id: 'risk-5', severity: 'LOW', title: 'AI queue latency', description: 'Monitor the AI Director queue during peak hours.', category: 'Operations' },
    ];
  }

  dashboard(): PresidentDashboard {
    return { health: this.health(), revenue: this.revenue(), channels: this.channels(), aiStatus: this.aiStatus(), risks: this.risks() };
  }
}
