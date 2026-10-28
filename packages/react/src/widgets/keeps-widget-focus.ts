/* @layer renderer-shell @kind logic */
import { WIDGET_KEEPS_FOCUS } from './keeps-widget-focus.constants';

const keepsWidgetFocus = (): { readonly 'data-widget-keeps-focus': '' } => ({ [WIDGET_KEEPS_FOCUS]: '' }) as const;

export { keepsWidgetFocus };
