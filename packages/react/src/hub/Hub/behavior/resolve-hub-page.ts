/* @layer renderer-shell @kind logic */
import type { ScreenParams } from '../../../navigation/navigation.type';
import type { HubPage } from '../../hub.type';
import type { HubSelection } from '../Hub.type';

const paramString = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const resolveHubPage = (pages: readonly HubPage[], home: HubPage, params: ScreenParams): HubSelection => {
  const section = paramString(params.section);
  const page = pages.find((candidate) => candidate.id === section) ?? home;
  const tabs = page.tabs ?? [];
  const wanted = paramString(params.tab);
  const tab = tabs.find((candidate) => candidate.id === wanted) ?? tabs.at(0) ?? null;
  return { page, tab };
};

export { resolveHubPage };
