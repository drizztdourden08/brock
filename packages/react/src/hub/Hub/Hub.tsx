/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useRef } from 'react';
import { NavLayout } from '@drizztdourden08/tessera/composites';
import { useHubSearch } from '../../settings/SettingsHub/behavior/useHubSearch';
import { DEFAULT_SEARCH_PLACEHOLDER } from '../hub.constants';
import type { HubSearchHit } from '../hub.type';
import { buildHubNav } from './behavior/build-hub-nav';
import { matchHubLabels } from './behavior/match-hub-labels';
import { useHubSearchShortcut } from './behavior/useHubSearchShortcut';
import { useHubState } from './behavior/useHubState';
import { HubSearchHits } from './sub-components/HubSearchHits';
import type { HubProps } from './Hub.type';

const Hub = (props: HubProps) => {
  const { def, ctx } = props;
  const rootRef = useRef<HTMLElement>(null);
  const { groups, pages, page, tab, context, selectPage } = useHubState(def, ctx);
  const { query, setQuery, clear } = useHubSearch();
  useHubSearchShortcut(rootRef, def.search !== undefined);

  const navConfig = useMemo(() => buildHubNav(def.home, groups), [def.home, groups]);
  const search = useMemo(() => (def.search
    ? { value: query, onChange: setQuery, placeholder: def.search.placeholder ?? DEFAULT_SEARCH_PLACEHOLDER }
    : undefined), [def.search, query, setQuery]);
  const index = useCallback((needle: string) => def.search?.index?.(needle) ?? matchHubLabels(pages, needle), [def.search, pages]);

  const openPage = useCallback((id: string) => { clear(); selectPage(id); }, [clear, selectPage]);
  const openHit = useCallback((hit: HubSearchHit) => { clear(); context.open({ section: hit.section, tab: hit.tab }); }, [clear, context]);

  return (
    <NavLayout
      ref={rootRef}
      nav={{ config: navConfig, activeId: page.id, onSelect: openPage, search }}
      results={search ? <HubSearchHits query={query} index={index} onOpen={openHit} /> : undefined}
    >
      {tab ? tab.render(context) : page.render(context)}
    </NavLayout>
  );
};

export { Hub };
