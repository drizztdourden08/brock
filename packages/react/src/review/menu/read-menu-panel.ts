/* @layer renderer-shell @kind logic */
import { closeMenu } from './close-menu';
import { labelOf } from './label-of';
import { menuItemsOf } from './menu-items-of';
import { walkMenu } from './walk-menu';

const readMenuPanel = async (parents: readonly string[]): Promise<string[] | null> => {
  await closeMenu();
  const panel = await walkMenu(parents);
  return panel ? menuItemsOf(panel).map(labelOf) : null;
};

export { readMenuPanel };
