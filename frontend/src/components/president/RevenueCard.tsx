<<<<<<< HEAD
import type { RevenueOverview } from '../../president/types';

export interface RevenueCardProps {
  revenue: RevenueOverview;
}

export function RevenueCard({ revenue }: RevenueCardProps) {
  const trendSign = revenue.trend >= 0 ? '+' : '';
  return (
    <section className="card" aria-label="Revenue Overview">
      <h3 className="card-title">Revenue Overview</h3>
      <div className="revenue-metrics">
        <div>
          <span>Total</span>
          <strong>{revenue.currency} ${revenue.total.toLocaleString()}</strong>
        </div>
        <div>
          <span>Monthly</span>
          <strong>{revenue.currency} ${revenue.monthly.toLocaleString()}</strong>
        </div>
        <div>
          <span>Trend</span>
          <strong className={revenue.trend >= 0 ? 'trend-up' : 'trend-down'}>{trendSign}{revenue.trend}%</strong>
        </div>
      </div>
    </section>
  );
}
=======
export function RevenueCard({ monthly, total, trendPercent }: { monthly: number; total: number; trendPercent: number }) { return <article><h3>Revenue</h3><p>Monthly: ${monthly.toLocaleString()}</p><p>Total: ${total.toLocaleString()} ({trendPercent}% trend)</p></article>; }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
