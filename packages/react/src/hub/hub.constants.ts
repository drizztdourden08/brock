/* @layer renderer-shell @kind constants */
import type { MenuEntry } from '../menu/menu.type';
import type { SearchAction } from '../search/search.type';
import type { ScreenDef } from '../screens/screen.type';
import type { HubDef } from './hub.type';

const HUB_DEFS = new WeakMap<ScreenDef, HubDef>();
const DEFAULT_SEARCH_PLACEHOLDER = 'Search';
const PAGE_SEARCH_KEY = 'header.search';
const NO_MENU: readonly MenuEntry[] = [];
const NO_ACTIONS: readonly SearchAction[] = [];

export { DEFAULT_SEARCH_PLACEHOLDER, HUB_DEFS, NO_ACTIONS, NO_MENU, PAGE_SEARCH_KEY };
