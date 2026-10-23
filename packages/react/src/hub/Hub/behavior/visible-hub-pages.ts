/* @layer renderer-shell @kind logic */
import type { HubDef, HubGroup, HubLiveLists, HubPage } from '../../hub.type';
import { NO_LIVE } from '../../hub.constants';
import type { HubPageList } from '../Hub.type';
import { isShown } from '../../../screens/show/is-shown';
import type { ShowContext } from '../../../screens/show/show.type';
import { expandLive } from './expand-live';

const isStatic = (page: HubPage): boolean => page.liveRef === undefined && page.disabled !== true;

const fallbacksOf = (def: HubDef, groups: readonly HubGroup[]): ReadonlyMap<string, HubPage> =>
  new Map(def.groups.flatMap((group) => group.pages
    .filter((page) => page.live !== undefined)
    .map((page): [string, HubPage] => [page.id, groups.find((shown) => shown.id === group.id)?.pages.find(isStatic) ?? def.home])));

const visibleHubPages = (def: HubDef, developerTools: boolean, show?: ShowContext, live: HubLiveLists = NO_LIVE): HubPageList => {
  const shown = (page: HubPage): boolean => (!page.devOnly || developerTools) && isShown(page.show, show);
  const groups = def.groups
    .map((group) => ({ ...group, pages: group.pages.filter(shown).flatMap((page) => expandLive(page, live[page.id] ?? [])) }))
    .filter((group) => group.pages.length > 0);
  const pages = [def.home, ...groups.flatMap((group) => group.pages).filter((page) => page.disabled !== true)];
  return { groups, pages, fallbacks: fallbacksOf(def, groups) };
};

export { visibleHubPages };
