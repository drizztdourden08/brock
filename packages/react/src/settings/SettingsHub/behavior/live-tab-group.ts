/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { SearchResultsGroup } from '@drizztdourden08/tessera/composites';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../../../i18n/fallback-text';
import type { TabDef } from '../../settings.type';
import { SettingsPageContext } from '../../SettingsLayout/behavior/settings-page-context';
import type { SettingsPageContextValue } from '../../SettingsLayout/SettingsLayout.type';
import { HubTabContent } from '../sub-components/HubTabContent';
import type { LiveTabGroupInput } from './live-tab-group.type';

const resultsContext = <S extends object>(tab: TabDef<S>, query: string, text: (value: Text) => string): SettingsPageContextValue =>
  ({ variant: 'results', icon: tab.navIcon, title: text(tab.label), query });

const liveTabGroup = <S extends object>(input: LiveTabGroupInput<S>): SearchResultsGroup => {
  const { tab, count, query, control, text = fallbackText, page = { id: tab.id, label: text(tab.label), icon: tab.navIcon } } = input;
  return {
    ...page,
    count,
    children: createElement(SettingsPageContext.Provider, { value: resultsContext(tab, query, text) }, createElement(HubTabContent<S>, { tab, ...control })),
  };
};

export { liveTabGroup };
