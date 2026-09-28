/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box, Button, EmptyState, Text } from '@drizztdourden08/tessera/primitives';
import type { TabDef } from '../../../settings.type';
import { SettingsPageContext } from '../../../SettingsLayout/behavior/settings-page-context';
import type { SettingsPageContextValue } from '../../../SettingsLayout/SettingsLayout.type';
import { matchTabs } from '../../behavior/match-tabs';
import { HubTabContent } from '../HubTabContent';
import type { HubSearchResultsProps } from './HubSearchResults.type';

const resultsContext = <S extends object>(tab: TabDef<S>, query: string): SettingsPageContextValue =>
  ({ variant: 'results', icon: tab.navIcon, title: tab.label, query });

const HubSearchResults = <S extends object>(props: HubSearchResultsProps<S>) => {
  const { tabs, query, onOpenTab, ...control } = props;
  const normalized = query.trim().toLowerCase();
  const matches = useMemo(() => matchTabs(tabs, control.settings, normalized), [tabs, control.settings, normalized]);

  if (normalized === '') {
    return <EmptyState className="hub-search__empty" message="Type to search every setting." />;
  }
  if (matches.total === 0 && matches.byName.length === 0) {
    return <EmptyState className="hub-search__empty" message={`No setting matches "${query.trim()}".`} />;
  }

  return (
    <Box className="hub-search">
      <Box className="hub-search__summary">
        <Text className="hub-search__count">
          {matches.total} {matches.total === 1 ? 'setting' : 'settings'} match &quot;{query.trim()}&quot;
        </Text>
        {matches.byName.length > 0 && (
          <Box className="hub-search__jumps">
            {matches.byName.map((tab) => (
              <Button key={tab.id} size="sm" variant="secondary" icon={tab.navIcon} onClick={() => onOpenTab(tab.id)}>
                {tab.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
      {matches.withRows.map(({ tab, count }) => (
        <Box key={tab.id} className="hub-search__tab" data-tab={tab.id}>
          <Button className="hub-search__tab-heading" variant="ghost" icon={tab.navIcon} onClick={() => onOpenTab(tab.id)}>
            {tab.label}
            <Text className="hub-search__tab-count">{count}</Text>
          </Button>
          <SettingsPageContext.Provider value={resultsContext(tab, normalized)}>
            <HubTabContent tab={tab} {...control} />
          </SettingsPageContext.Provider>
        </Box>
      ))}
    </Box>
  );
};

export { HubSearchResults };
