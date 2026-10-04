/* @layer renderer-shell @kind logic */
import { HISTORY_LENGTH } from '../PerformanceWidget.constants';

const pushSeries = (series: readonly number[] | undefined, value: number): number[] => [...(series ?? []).slice(1 - HISTORY_LENGTH), value];

export { pushSeries };
