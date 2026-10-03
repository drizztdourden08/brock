/* @layer renderer-shell @kind logic */
import { until } from '../dom/until';

const soon = (check: () => boolean): Promise<boolean> => until(() => Promise.resolve(check()));

export { soon };
