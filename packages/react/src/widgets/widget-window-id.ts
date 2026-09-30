/* @layer renderer-shell @kind logic */
import { WIDGET_QUERY_KEY } from './widget.constants';

const widgetWindowId = (): string | null =>
  (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get(WIDGET_QUERY_KEY));

export { widgetWindowId };
