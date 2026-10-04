/* @layer renderer-shell @kind component */
import type { WidgetMeta } from '../widget.type';
import { LogsWidget } from './LogsWidget';

const meta: WidgetMeta = {
  label: 'Logs',
  icon: 'file-text',
  defaultSide: 'bottom',
  defaultDockedSize: 240,
  defaultFloatingSize: { width: 640, height: 360 },
  popOut: true,
  padding: 'none',
  fill: true,
};

export default LogsWidget;
export { meta };
