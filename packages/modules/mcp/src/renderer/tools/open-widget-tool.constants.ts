/* @layer renderer-shell @kind constants */
import { widgets } from '@drizztdourden08/brock-react';

const WIDGET_ACTIONS = new Map<string, (id: string) => void>([
  ['open', widgets.open],
  ['close', widgets.close],
  ['focus', widgets.focus],
]);

export { WIDGET_ACTIONS };
