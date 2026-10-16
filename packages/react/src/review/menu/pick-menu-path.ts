/* @layer renderer-shell @kind logic */
import { click } from '../dom/click';
import { closeMenu } from './close-menu';
import { walkMenu } from './walk-menu';

const pickMenuPath = async (path: readonly string[]): Promise<boolean> => {
  const last = path.at(-1);
  const item = last === undefined ? null : await walkMenu(path.slice(0, -1), last);
  if (item) {
    click(item);
    return true;
  }
  await closeMenu();
  return false;
};

export { pickMenuPath };
