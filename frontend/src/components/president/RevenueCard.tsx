import type { RevenueOverview } from '../../president/types';

interface RevenueCardProps {
  revenue?: RevenueOverview;
  monthly?: number;
  total?: number;
  trendPercent?: number;
}

export function RevenueCard({ revenue, monthly, total, trendPercent }: RevenueCardProps) {
  const monthlyValue = revenue?.monthly ?? monthly ?? 0;
  const totalValue = revenue?.total ?? total ?? 0;
  const trend = revenue?.trend ?? trendPercent ?? 0;
  const currency = revenue?.currency ?? 'USD';
  return (
    <article>
      <h3>Revenue Overview</h3>
      <p>Monthly: {currency} {monthlyValue.toLocaleString()}</p>
      <p>Total: {currency} {totalValue.toLocaleString()}</p>
      <p>Trend: {trend >= 0 ? '+' : ''}{trend}%</p>
    </article>
  );
}
