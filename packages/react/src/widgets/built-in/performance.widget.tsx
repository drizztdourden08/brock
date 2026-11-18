/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { WidgetMeta } from '../widget.type';
import { PerformanceSettings, PerformanceWidget } from './PerformanceWidget';

const meta: WidgetMeta = {
  label: msg('brock-app:widgets.performance.label'),
  icon: 'cpu',
  defaultSide: 'right',
  defaultDockedSize: 340,
  defaultFloatingSize: { width: 420, height: 520 },
  popOut: true,
  settings: PerformanceSettings,
  devOnly: true,
  menu: { developer: true },
};

export default PerformanceWidget;
export { meta };
