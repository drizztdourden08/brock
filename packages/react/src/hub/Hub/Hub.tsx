/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useRef } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { SectionNav } from '@drizztdourden08/tessera/composites';
import { useHubSearch } from '../../settings/SettingsHub/behavior/useHubSearch';
import { DEFAULT_SEARCH_PLACEHOLDER } from '../hub.constants';
import type { HubSearchHit } from '../hub.type';
import { buildHubNav } from './behavior/build-hub-nav';
import { keepSearchOnEscape } from './behavior/keep-search-on-escape';
import { matchHubLabels } from './behavior/match-hub-labels';
import { useHubSearchShortcut } from './behavior/useHubSearchShortcut';
import { useHubState } from './behavior/useHubState';
import { HubPagePane } from './sub-components/HubPagePane';
import { HubSearchHits } from './sub-components/HubSearchHits';
import type { HubProps } from './Hub.type';
import './Hub.css';

const Hub = (props: HubProps) => {
  const { def, ctx } = props;
  const rootRef = useRef<HTMLElement>(null);
  const { groups, pages, page, tab, context, selectPage } = useHubState(def, ctx);
  const { query, setQuery, setFocused, searching, clear } = useHubSearch();
  useHubSearchShortcut(rootRef, def.search !== undefined);

  const navConfig = useMemo(() => buildHubNav(def.home, groups), [def.home, groups]);
  const search = useMemo(() => (def.search
    ? { value: query, onChange: setQuery, placeholder: def.search.placeholder ?? DEFAULT_SEARCH_PLACEHOLDER, onFocusChange: setFocused }
    : undefined), [def.search, query, setQuery, setFocused]);
  const index = useCallback((needle: string) => def.search?.index?.(needle) ?? matchHubLabels(pages, needle), [def.search, pages]);

  const openPage = useCallback((id: string) => { clear(); selectPage(id); }, [clear, selectPage]);
  const openHit = useCallback((hit: HubSearchHit) => { clear(); context.open({ section: hit.section, tab: hit.tab }); }, [clear, context]);

  return (
    <Box ref={rootRef} className="hub-screen" onKeyDown={keepSearchOnEscape(query)}>
      <SectionNav config={navConfig} activeId={searching ? '' : page.id} onSelect={openPage} search={search} />
      <Box className="hub-screen__content">
        {searching
          ? <HubSearchHits query={query} index={index} onOpen={openHit} />
          : <HubPagePane page={page} tab={tab} context={context} />}
      </Box>
    </Box>
  );
};

export { Hub };
