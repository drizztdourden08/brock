/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { SearchResultsGroup } from '@drizztdourden08/tessera/composites';
import type { TabDef } from '../../settings.type';
import { SettingsPageContext } from '../../SettingsLayout/behavior/settings-page-context';
import type { SettingsPageContextValue } from '../../SettingsLayout/SettingsLayout.type';
import { HubTabContent } from '../sub-components/HubTabContent';
import type { LiveTabGroupInput } from './live-tab-group.type';

const resultsContext = <S extends object>(tab: TabDef<S>, query: string): SettingsPageContextValue =>
  ({ variant: 'results', icon: tab.navIcon, title: tab.label, query });

const liveTabGroup = <S extends object>(input: LiveTabGroupInput<S>): SearchResultsGroup => {
  const { tab, count, query, control, page = { id: tab.id, label: tab.label, icon: tab.navIcon } } = input;
  return {
    ...page,
    count,
    children: createElement(SettingsPageContext.Provider, { value: resultsContext(tab, query) }, createElement(HubTabContent<S>, { tab, ...control })),
  };
};

export { liveTabGroup };
