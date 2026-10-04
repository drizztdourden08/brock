/* @layer renderer-shell @kind logic */
import type { ScreenParams } from '../../../navigation/navigation.type';
import { matchSub } from '../../../screens/conventions/match-sub';
import type { HubPage } from '../../hub.type';
import type { HubSelection } from '../Hub.type';

const paramString = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const resolveHubPage = (pages: readonly HubPage[], home: HubPage, params: ScreenParams): HubSelection => {
  const section = paramString(params.section);
  const page = pages.find((candidate) => candidate.id === section) ?? home;
  const tabs = page.tabs ?? [];
  const wanted = paramString(params.tab);
  const named = tabs.find((candidate) => candidate.id === wanted);
  const found = named === undefined && wanted !== null ? matchSub(page.subs ?? [], wanted) : null;
  if (found) return { page, tab: null, sub: found.sub, subParams: found.params };
  return { page, tab: named ?? tabs.at(0) ?? null, sub: null, subParams: {} };
};

export { resolveHubPage };
