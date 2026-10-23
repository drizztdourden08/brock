/* @layer renderer-shell @kind constants */
import type { MenuEntry } from '../menu/menu.type';
import type { SearchAction } from '../search/search.type';
import type { ScreenDef } from '../screens/screen.type';
import type { HubDef, HubLiveLists, LiveBadge } from './hub.type';

const HUB_DEFS = new WeakMap<ScreenDef, HubDef>();
const HUB_WINDOW_KEY = 'brock.hub';
const DEFAULT_SEARCH_PLACEHOLDER = 'Search';
const PAGE_SEARCH_KEY = 'header.search';
const NO_MENU: readonly MenuEntry[] = [];
const NO_ACTIONS: readonly SearchAction[] = [];
const NO_LIVE: HubLiveLists = {};
const LIVE_BADGES: Readonly<Record<LiveBadge, { color: 'success' | 'warning'; label: string }>> = {
  ok: { color: 'success', label: 'OK' },
  warn: { color: 'warning', label: 'Needs attention' },
};

export { DEFAULT_SEARCH_PLACEHOLDER, HUB_DEFS, HUB_WINDOW_KEY, LIVE_BADGES, NO_ACTIONS, NO_LIVE, NO_MENU, PAGE_SEARCH_KEY };
