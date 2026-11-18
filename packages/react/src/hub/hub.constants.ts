/* @layer renderer-shell @kind constants */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { MenuEntry } from '../menu/menu.type';
import type { SearchAction } from '../search/search.type';
import type { ScreenDef } from '../screens/screen.type';
import type { HubDef, HubLiveLists, LiveBadge } from './hub.type';

const HUB_DEFS = new WeakMap<ScreenDef, HubDef>();
const HUB_WINDOW_KEY = 'brock.hub';
const DEFAULT_SEARCH_PLACEHOLDER = msg('brock-app:hub.search.placeholder');
const PAGE_SEARCH_KEY = 'header.search';
const NO_MENU: readonly MenuEntry[] = [];
const NO_ACTIONS: readonly SearchAction[] = [];
const NO_LIVE: HubLiveLists = {};
const LIVE_BADGES: Readonly<Record<LiveBadge, { color: 'success' | 'warning'; label: Text }>> = {
  ok: { color: 'success', label: msg('brock-app:hub.badge.ok') },
  warn: { color: 'warning', label: msg('brock-app:hub.badge.warn') },
};

export { DEFAULT_SEARCH_PLACEHOLDER, HUB_DEFS, HUB_WINDOW_KEY, LIVE_BADGES, NO_ACTIONS, NO_LIVE, NO_MENU, PAGE_SEARCH_KEY };
