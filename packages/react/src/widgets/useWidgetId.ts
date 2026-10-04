/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import { WidgetIdContext } from './widget-id-context';

const useWidgetId = (): string | null => useContext(WidgetIdContext);

export { useWidgetId };
