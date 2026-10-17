/* @layer renderer-shell @kind logic */
import { KIT_KEY_PREFIX } from './kits/widget-kit.constants';
import { WIDGET_KEY_PREFIX, WIDGETS_DEVELOPER_KEY } from './widget.constants';

const widgetMenuGrows = (key: string, parent: string): boolean =>
  parent !== WIDGETS_DEVELOPER_KEY && (key === WIDGETS_DEVELOPER_KEY || key.startsWith(WIDGET_KEY_PREFIX) || key.startsWith(KIT_KEY_PREFIX));

export { widgetMenuGrows };
