/* @layer renderer-shell @kind logic */
import type { GaugeThresholds, StatusTone } from '@drizztdourden08/tessera/primitives';

const levelTone = (value: number, thresholds: GaugeThresholds): StatusTone | undefined => {
  if (value >= thresholds.danger) return 'danger';
  if (value >= thresholds.warning) return 'warning';
  return undefined;
};

export { levelTone };
