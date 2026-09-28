/* @layer renderer-shell @kind component */
import { useCallback, useMemo, useState } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { SectionNav } from '@drizztdourden08/tessera/composites';
import { usePlatform } from '../../platform/usePlatform';
import type { SettingsPageContextValue } from '../SettingsLayout/SettingsLayout.type';
import { useHubNav } from './behavior/useHubNav';
import { useHubSearch } from './behavior/useHubSearch';
import { HubContent } from './sub-components/HubContent';
import type { SettingsHubProps } from './SettingsHub.type';
import './SettingsHub.css';

const SettingsHub = <S extends object>(props: SettingsHubProps<S>) => {
  const {
    tabs, activeTab: controlledTab, onTabChange, backdrop, searchPlaceholder = 'Search all settings',
    homeTabId, className = '', ...control
  } = props;
  const { info } = usePlatform();
  const { navConfig, visibleTabs, home } = useHubNav(tabs, info.formFactor, homeTabId);

  const [internalTab, setInternalTab] = useState(home?.id ?? '');
  const activeId = controlledTab ?? internalTab;
  const { query, setQuery, setFocused, searching, clear } = useHubSearch();

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

  return (
    <Box className={`settings-hub${className ? ` ${className}` : ''}`}>
      <SectionNav
        config={navConfig}
        activeId={searching ? '' : activeId}
        onSelect={openTab}
        search={{ value: query, onChange: setQuery, placeholder: searchPlaceholder, onFocusChange: setFocused }}
      />
      <Box className="settings-hub__content">
        <HubContent
          searching={searching}
          query={query}
          tabs={visibleTabs}
          active={active}
          pageContext={pageContext}
          onOpenTab={openTab}
          {...control}
        />
      </Box>
    </Box>
  );
};

export { SettingsHub };
