/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { MonitorInfo } from '../../../display.type';
import { FOLLOW_WINDOW_LABEL } from '../DisplaySettingsTab.constants';

const monitorText = (monitor: MonitorInfo): Text => {
  const { label, width, height, primary } = monitor;
  const hz = monitor.refreshHz ? Math.round(monitor.refreshHz) : 0;
  if (hz) {
    return primary
      ? msg('display:monitor.optionRatePrimary', { label, width, height, hz })
      : msg('display:monitor.optionRate', { label, width, height, hz });
  }
  return primary
    ? msg('display:monitor.optionPrimary', { label, width, height })
    : msg('display:monitor.option', { label, width, height });
};

const monitorOptions = (monitors: MonitorInfo[], text: (value: Text) => string): SelectOption[] => [
  { value: '', label: text(FOLLOW_WINDOW_LABEL) },
  ...monitors.map((monitor) => ({ value: monitor.id, label: text(monitorText(monitor)) })),
];

export { monitorOptions };
