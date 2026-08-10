export interface HealthMetric {
  id: string;
  name: string;
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  message: string;
}

export interface RevenueOverview {
  total: number;
  monthly: number;
  trend: number;
  currency: string;
}

export interface ChannelStat {
  id: string;
  title: string;
  subscribers: string;
  growth: number;
  monetized: boolean;
}

export interface AIStatus {
  id: string;
  name: string;
  state: 'ACTIVE' | 'IDLE' | 'ERROR';
  lastActive: string;
  message: string;
}

export interface RiskAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  category: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  completed: boolean;
  score: number;
}

export interface TrainingProgress {
  modulesCompleted: number;
  totalModules: number;
  overallScore: number;
  nextSteps: string[];
  modules: TrainingModule[];
}

export interface HeirDashboard {
  health: HealthMetric[];
  revenue: RevenueOverview;
  channels: ChannelStat[];
  aiStatus: AIStatus[];
  risks: RiskAlert[];
  training: TrainingProgress;
}
