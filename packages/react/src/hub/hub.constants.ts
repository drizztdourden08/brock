/* @layer renderer-shell @kind constants */
import type { ScreenDef } from '../screens/screen.type';
import type { HubDef, HubTab } from './hub.type';

const HUB_DEFS = new WeakMap<ScreenDef, HubDef>();
const HUB_SEARCH_SHORTCUT = 'Mod+K';
const SEARCH_MARK_SELECTOR = '.section-nav__search-mark';
const DEFAULT_SEARCH_PLACEHOLDER = 'Search';
const NO_TABS: HubTab[] = [];

export { DEFAULT_SEARCH_PLACEHOLDER, HUB_DEFS, HUB_SEARCH_SHORTCUT, NO_TABS, SEARCH_MARK_SELECTOR };
