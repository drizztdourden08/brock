/* @layer renderer-shell @kind component */
import type { WidgetMeta } from '../widget.type';
import { PerformanceSettings, PerformanceWidget } from './PerformanceWidget';

const meta: WidgetMeta = {
  label: 'Performance',
  icon: 'cpu',
  defaultSide: 'right',
  defaultDockedSize: 340,
  defaultFloatingSize: { width: 420, height: 520 },
  popOut: true,
  settings: PerformanceSettings,
};

export default PerformanceWidget;
export { meta };
