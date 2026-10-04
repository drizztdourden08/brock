/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { SideNavLayout } from '@drizztdourden08/tessera/composites';
import { activateEntry } from '../../search/activate-entry';
import type { SearchEntry } from '../../search/search.type';
import { useHubSearch } from '../../settings/SettingsHub/behavior/useHubSearch';
import { DEFAULT_SEARCH_PLACEHOLDER } from '../hub.constants';
import type { HubSearchHit } from '../hub.type';
import { buildHubNav } from './behavior/build-hub-nav';
import { useHubState } from './behavior/useHubState';
import { HubIndexResults } from './sub-components/HubIndexResults';
import { HubPageFrame } from './sub-components/HubPageFrame';
import { HubSearchHits } from './sub-components/HubSearchHits';
import { hubContent } from './behavior/hub-content';
import { hubScope } from './behavior/hub-scope';
import { joinRoute } from '../../navigation/join-route';
import { ScreenStateScope } from '../../screens/screen-state-scope';
import type { HubProps } from './Hub.type';

const Hub = (props: HubProps) => {
  const { def, ctx } = props;
  const { groups, pages, page, tab, sub, context, selectPage, selectTab, up } = useHubState(def, ctx);
  const { query, setQuery, clear } = useHubSearch();

  const navConfig = useMemo(() => buildHubNav(def.home, groups), [def.home, groups]);
  const search = useMemo(() => (def.search
    ? { value: query, onChange: setQuery, placeholder: def.search.placeholder ?? DEFAULT_SEARCH_PLACEHOLDER }
    : undefined), [def.search, query, setQuery]);

  const openPage = useCallback((id: string) => { clear(); selectPage(id); }, [clear, selectPage]);
  const openHit = useCallback((hit: HubSearchHit) => { clear(); context.open({ section: hit.section, tab: hit.tab }); }, [clear, context]);
  const openEntry = useCallback((entry: SearchEntry) => { clear(); activateEntry(entry); }, [clear]);

  const ownIndex = def.search?.index;
  const indexed = <HubIndexResults def={def} pages={pages} query={query} onOpen={openEntry} onOpenPage={openPage} />;
  const results = ownIndex ? <HubSearchHits query={query} index={ownIndex} onOpen={openHit} /> : indexed;

  return (
    <SideNavLayout nav={{ config: navConfig, activeId: page.id, onSelect: openPage, search }} results={search ? results : undefined}>
      <ScreenStateScope.Provider value={hubScope(context)}>
        <HubPageFrame key={`${page.id}/${sub?.id ?? ''}`} page={page} tab={tab} sub={sub} route={joinRoute(def.id, page.id)} onSelectTab={selectTab} onUp={up}>
          {hubContent(context)}
        </HubPageFrame>
      </ScreenStateScope.Provider>
    </SideNavLayout>
  );
};

export { Hub };
