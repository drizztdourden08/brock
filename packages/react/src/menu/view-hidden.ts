/* @layer renderer-shell @kind logic */
import { VIEW_MENU_KEY } from './menu-config.constants';
import type { MenuConfig } from './menu-config.type';

const viewHidden = (config: MenuConfig | undefined): boolean => {
  const view = config?.entries?.[VIEW_MENU_KEY];
  return view?.hidden === true || view?.inMenu === false;
};

export { viewHidden };
