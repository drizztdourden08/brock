/* @layer renderer-shell @kind logic */
import type { ScreenParams } from '../../../navigation/navigation.type';
import { matchSub } from '../../../screens/conventions/match-sub';
import { tabStateKey } from './tab-state-key';
import type { HubPage, HubTab } from '../../hub.type';
import type { HubSelection } from '../Hub.type';

const paramString = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const tabById = (page: HubPage, id: unknown): HubTab | undefined => page.tabs?.find((candidate) => candidate.id === id);

const pickTab = (page: HubPage, wanted: string | null, lastTabs: Readonly<Record<string, unknown>>): HubTab | null => {
  const last = wanted === null ? tabById(page, lastTabs[tabStateKey(page.id)]) : undefined;
  return tabById(page, wanted) ?? last ?? page.tabs?.at(0) ?? null;
};

const resolveHubPage = (pages: readonly HubPage[], home: HubPage, params: ScreenParams, lastTabs: Readonly<Record<string, unknown>> = {}): HubSelection => {
  const section = paramString(params.section);
  const page = pages.find((candidate) => candidate.id === section) ?? home;
  const wanted = paramString(params.tab);
  const found = wanted !== null && tabById(page, wanted) === undefined ? matchSub(page.subs ?? [], wanted) : null;
  if (found) return { page, tab: null, sub: found.sub, subParams: found.params };
  return { page, tab: pickTab(page, wanted, lastTabs), sub: null, subParams: {} };
};

export { resolveHubPage };
