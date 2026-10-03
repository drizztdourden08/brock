/* @layer renderer-shell @kind logic */
import { until } from '../dom/until';
import { poppedWindowOf } from '../steps/popped-window-of';

const windowOpen = (id: string, open: boolean): Promise<boolean> => until(async () => {
  const info = await poppedWindowOf(id);
  return open ? info?.visible === true : info === null;
});

export { windowOpen };
