/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { guardWidgetFocus } from './guard-widget-focus';

const useWidgetsNeverFocus = (enabled: boolean): void => {
  useEffect(() => (enabled ? guardWidgetFocus(document) : undefined), [enabled]);
};

export { useWidgetsNeverFocus };
