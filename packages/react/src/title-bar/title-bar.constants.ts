/* @layer renderer-shell @kind constants */
import type { TitleBarItemEntry } from './title-bar-item.type';

const BAR_ITEM_ATTRIBUTE = 'data-bar-item';

const BAR_ACTION_PREFIX = 'action:';

const MENU_BUTTON_SELECTOR = '.window-title-bar__start .dropdown-trigger';

const NO_TITLE_BAR_ITEMS: readonly TitleBarItemEntry[] = [];

export { BAR_ACTION_PREFIX, BAR_ITEM_ATTRIBUTE, MENU_BUTTON_SELECTOR, NO_TITLE_BAR_ITEMS };
