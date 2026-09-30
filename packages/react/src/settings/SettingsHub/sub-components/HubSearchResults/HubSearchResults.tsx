/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { SearchResults } from '@drizztdourden08/tessera/composites';
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
  const shown = query.trim();
  const normalized = shown.toLowerCase();
  const matches = useMemo(() => matchTabs(tabs, control.settings, normalized), [tabs, control.settings, normalized]);

  const groups = matches.withRows.map(({ tab, count }) => ({
    id: tab.id,
    label: tab.label,
    icon: tab.navIcon,
    count,
    children: (
      <SettingsPageContext.Provider value={resultsContext(tab, normalized)}>
        <HubTabContent tab={tab} {...control} />
      </SettingsPageContext.Provider>
    ),
  }));

  return (
    <SearchResults
      framed
      query={query}
      count={matches.total}
      summary={`${matches.total} ${matches.total === 1 ? 'setting' : 'settings'} match "${shown}"`}
      jumps={matches.byName.map((tab) => ({ id: tab.id, label: tab.label, icon: tab.navIcon }))}
      onJump={onOpenTab}
      groups={groups}
      onOpenGroup={onOpenTab}
      idleMessage="Type to search every setting."
      emptyMessage={`No setting matches "${shown}".`}
    />
  );
};

export { HubSearchResults };
