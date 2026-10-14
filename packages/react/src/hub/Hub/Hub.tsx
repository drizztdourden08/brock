/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { SideNavLayout } from '@drizztdourden08/tessera/composites';
import { Box } from '@drizztdourden08/tessera/primitives';
import { activateEntry } from '../../search/activate-entry';
import type { SearchEntry } from '../../search/search.type';
import { useHubSearch } from '../../settings/SettingsHub/behavior/useHubSearch';
import { DEFAULT_SEARCH_PLACEHOLDER } from '../hub.constants';
import type { HubSearchHit } from '../hub.type';
import { buildHubNav } from './behavior/build-hub-nav';
import { hubNavKey } from './behavior/hub-nav-key';
import { useHubState } from './behavior/useHubState';
import { HubIndexResults } from './sub-components/HubIndexResults';
import { HubPageSlot } from './sub-components/HubPageSlot';
import { HubSearchHits } from './sub-components/HubSearchHits';
import { useKeptPages } from './behavior/useKeptPages';
import type { HubProps } from './Hub.type';
import './Hub.css';

const Hub = (props: HubProps) => {
  const { def, ctx } = props;
  const { groups, pages, page, context, selectPage, selectTab, up } = useHubState(def, ctx);
  const kept = useKeptPages(page, context);
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
    <SideNavLayout nav={{ config: navConfig, activeId: page.id, onSelect: openPage, search, storageKey: hubNavKey(def.id) }} results={search ? results : undefined}>
      {page.keepMounted !== true && <HubPageSlot context={context} onSelectTab={selectTab} onUp={up} />}
      {kept.map((entry) => (
        <Box key={`kept:${entry.id}`} className="hub__kept" hidden={!entry.shown}>
          <HubPageSlot context={entry.context} onSelectTab={selectTab} onUp={up} />
        </Box>
      ))}
    </SideNavLayout>
  );
};

export { Hub };
