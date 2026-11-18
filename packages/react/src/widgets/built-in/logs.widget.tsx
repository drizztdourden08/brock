/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { WidgetMeta } from '../widget.type';
import { LogsWidget } from './LogsWidget';

const meta: WidgetMeta = {
  label: msg('brock-app:widgets.logs.label'),
  icon: 'file-text',
  defaultSide: 'bottom',
  defaultDockedSize: 240,
  defaultFloatingSize: { width: 640, height: 360 },
  popOut: true,
  padding: 'none',
  fill: true,
  devOnly: true,
  menu: { developer: true },
};

export default LogsWidget;
export { meta };
