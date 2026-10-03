/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useState } from 'react';
import { SideNavLayout } from '@drizztdourden08/tessera/composites';
import { usePlatform } from '../../platform/usePlatform';
import { SettingsPageContext } from '../SettingsLayout/behavior/settings-page-context';
import type { SettingsPageContextValue } from '../SettingsLayout/SettingsLayout.type';
import { useHubNav } from './behavior/useHubNav';
import { useHubSearch } from './behavior/useHubSearch';
import { HubSearchResults } from './sub-components/HubSearchResults';
import { HubTabContent } from './sub-components/HubTabContent';
import type { SettingsHubProps } from './SettingsHub.type';

const SettingsHub = <S extends object>(props: SettingsHubProps<S>) => {
  const {
    tabs, activeTab: controlledTab, onTabChange, backdrop, searchPlaceholder = 'Search all settings',
    homeTabId, className = '', ...control
  } = props;
  const { info } = usePlatform();
  const { navConfig, visibleTabs, home } = useHubNav(tabs, info.formFactor, homeTabId);

  const [internalTab, setInternalTab] = useState(home?.id ?? '');
  const activeId = controlledTab ?? internalTab;
  const { query, setQuery, clear } = useHubSearch();

  const openTab = useCallback((id: string) => {
    clear();
    setInternalTab(id);
    onTabChange?.(id);
  }, [clear, onTabChange]);

  const active = visibleTabs.find((tab) => tab.id === activeId) ?? home;
  const pageContext = useMemo<SettingsPageContextValue | null>(
    () => (active ? { variant: 'page', icon: active.navIcon, title: active.label, backdrop, query: '' } : null),
    [active, backdrop],
  );
  const search = useMemo(() => ({ value: query, onChange: setQuery, placeholder: searchPlaceholder }), [query, setQuery, searchPlaceholder]);

  return (
    <SideNavLayout
      className={className}
      nav={{ config: navConfig, activeId, onSelect: openTab, search }}
      results={<HubSearchResults tabs={visibleTabs} query={query} onOpenTab={openTab} {...control} />}
    >
      {active && pageContext && (
        <SettingsPageContext.Provider value={pageContext}>
          <HubTabContent tab={active} {...control} />
        </SettingsPageContext.Provider>
      )}
    </SideNavLayout>
  );
};

export { SettingsHub };
