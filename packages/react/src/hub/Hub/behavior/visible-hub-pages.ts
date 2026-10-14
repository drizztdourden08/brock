/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../../hub.type';
import type { HubPageList } from '../Hub.type';
import { isShown } from '../../../screens/show/is-shown';
import type { ShowContext } from '../../../screens/show/show.type';

const visibleHubPages = (def: HubDef, developerTools: boolean, show?: ShowContext): HubPageList => {
  const shown = (page: HubPage): boolean => (!page.devOnly || developerTools) && isShown(page.show, show);
  const groups = def.groups
    .map((group) => ({ ...group, pages: group.pages.filter(shown) }))
    .filter((group) => group.pages.length > 0);
  return { groups, pages: [def.home, ...groups.flatMap((group) => group.pages)] };
};

export { visibleHubPages };
