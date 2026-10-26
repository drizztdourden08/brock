/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { SideNavLayout } from '@drizztdourden08/tessera/composites';
import { Box, ScrollArea } from '@drizztdourden08/tessera/primitives';
import { useRoutePreloader } from '../../../../lazy/useRoutePreloader';
import { joinRoute } from '../../../../navigation/join-route';
import { activateEntry } from '../../../../search/activate-entry';
import type { SearchEntry } from '../../../../search/search.type';
import { useHubSearch } from '../../../../settings/SettingsHub/behavior/useHubSearch';
import { DEFAULT_SEARCH_PLACEHOLDER } from '../../../hub.constants';
import type { HubSearchHit } from '../../../hub.type';
import { buildHubNav } from '../../behavior/build-hub-nav';
import { hubNavKey } from '../../behavior/hub-nav-key';
import { isBarePage } from '../../behavior/is-bare-page';
import { navPageCount } from '../../behavior/nav-page-count';
import { showsHubNav } from '../../behavior/shows-hub-nav';
import { useHubState } from '../../behavior/useHubState';
import { HubIndexResults } from '../HubIndexResults';
import { HubPageSlot } from '../HubPageSlot';
import { HubSearchHits } from '../HubSearchHits';
import { useKeptPages } from '../../behavior/useKeptPages';
import type { HubBodyProps } from '../../Hub.type';

const HubBody = (props: HubBodyProps) => {
  const { def, ctx, live } = props;
  const { groups, pages, homeListed, page, sub, context, selectPage, selectTab, up } = useHubState(def, ctx, live);
  const bare = isBarePage(def, page, sub);
  const kept = useKeptPages(page, context);
  const { query, setQuery, clear } = useHubSearch();

  const preload = useRoutePreloader();
  const navConfig = useMemo(() => buildHubNav(homeListed ? def.home : undefined, groups, (id) => preload(joinRoute(def.id, id)), def.top), [homeListed, def.home, def.id, def.top, groups, preload]);
  const search = useMemo(() => (def.search
    ? { value: query, onChange: setQuery, placeholder: def.search.placeholder ?? DEFAULT_SEARCH_PLACEHOLDER }
    : undefined), [def.search, query, setQuery]);

  const openPage = useCallback((id: string) => { clear(); selectPage(id); }, [clear, selectPage]);
  const openHit = useCallback((hit: HubSearchHit) => { clear(); context.open({ section: hit.section, tab: hit.tab }); }, [clear, context]);
  const openEntry = useCallback((entry: SearchEntry) => { clear(); activateEntry(entry); }, [clear]);

  const ownIndex = def.search?.index;
  const indexed = <HubIndexResults def={def} pages={pages} query={query} onOpen={openEntry} onOpenPage={openPage} />;
  const results = ownIndex ? <HubSearchHits query={query} index={ownIndex} onOpen={openHit} /> : indexed;

  const content = (
    <>
      {page.keepMounted !== true && <HubPageSlot context={context} onSelectTab={selectTab} onUp={up} />}
      {kept.map((entry) => (
        <Box key={`kept:${entry.id}`} className="hub__kept" hidden={!entry.shown}>
          <HubPageSlot context={entry.context} onSelectTab={selectTab} onUp={up} />
        </Box>
      ))}
    </>
  );

  if (!showsHubNav(def.nav, navPageCount({ pages, homeListed }))) return bare ? <Box className="hub__solo">{content}</Box> : <ScrollArea className="hub__solo">{content}</ScrollArea>;
  return (
    <SideNavLayout paneScroll={bare ? 'none' : 'page'} nav={{ config: navConfig, activeId: page.id, onSelect: openPage, search, storageKey: hubNavKey(def.id) }} results={search ? results : undefined}>
      {content}
    </SideNavLayout>
  );
};

export { HubBody };
