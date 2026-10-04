/* @layer renderer-shell @kind logic */
import type { SeriesChange } from '../PerformanceWidget.type';

const seriesChange = (series: readonly number[], still: number, format: (value: number) => string): SeriesChange => {
  const last = series.at(-1) ?? 0;
  const change = last - (series.at(-2) ?? last);
  if (Math.abs(change) < still) return { trend: 'flat', text: format(0) };
  return { trend: change > 0 ? 'up' : 'down', text: `${change > 0 ? '+' : '-'}${format(Math.abs(change))}` };
};

export { seriesChange };
