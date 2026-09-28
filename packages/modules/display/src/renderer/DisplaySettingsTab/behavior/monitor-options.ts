/* @layer renderer-shell @kind logic */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { MonitorInfo } from '../../../display.type';
import { FOLLOW_WINDOW_OPTION } from '../DisplaySettingsTab.constants';

const monitorLabel = (monitor: MonitorInfo): string => {
  const size = `${monitor.width}x${monitor.height}`;
  const rate = monitor.refreshHz ? `, ${Math.round(monitor.refreshHz)} Hz` : '';
  return `${monitor.label} (${size}${rate}${monitor.primary ? ', primary' : ''})`;
};

const monitorOptions = (monitors: MonitorInfo[]): SelectOption[] => [
  FOLLOW_WINDOW_OPTION,
  ...monitors.map((monitor) => ({ value: monitor.id, label: monitorLabel(monitor) })),
];

export { monitorOptions };
