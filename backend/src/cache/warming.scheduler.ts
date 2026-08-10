import { schedule, type ScheduledTask } from 'node-cron';
import type { PlatformLogger } from '../shared/logger.js';
import type { CacheWarmingService } from './warming.service.js';

export class CacheWarmingScheduler {
  private task: ScheduledTask | undefined;

  constructor(
    private readonly service: CacheWarmingService,
    private readonly intervalSeconds: number,
    private readonly logger: PlatformLogger,
  ) {}

  start(): void {
    if (this.task) return;
    this.task = schedule(this.cronExpression(), () => {
      void this.service.refreshScheduled().catch((error: unknown) => {
        this.logger.error('Scheduled cache refresh failed.', {
          error: error instanceof Error ? error.message : 'Unknown cache refresh error',
        });
      });
    });
  }

  private cronExpression(): string {
    const minutes = this.intervalSeconds / 60;
    if (minutes < 60) return `*/${minutes} * * * *`;
    return `0 */${minutes / 60} * * *`;
  }

  stop(): void {
    this.task?.stop();
    this.task = undefined;
  }
}
