/* @layer renderer-shell @kind logic */
import type { SearchResultsGroup } from '@drizztdourden08/tessera/composites';
import { liveTabGroup } from '../../../settings/SettingsHub/behavior/live-tab-group';
import { matchTabs } from '../../../settings/SettingsHub/behavior/match-tabs';
import type { SettingsControlProps, TabDef } from '../../../settings/settings.type';
import type { HubPage } from '../../hub.type';

const hubLiveGroups = <S extends object>(pages: readonly HubPage[], tabs: readonly TabDef<S>[], query: string, control: SettingsControlProps<S>): SearchResultsGroup[] => {
  const paired = pages.flatMap((page) => tabs.filter((tab) => tab.id === page.settingsTab).map((tab) => ({ page, tab })));
  const { withRows } = matchTabs(paired.map(({ tab }) => tab), control.settings, query);
  return withRows.flatMap(({ tab, count }) => {
    const page = paired.find((pair) => pair.tab === tab)?.page;
    return page ? [liveTabGroup({ tab, count, query, control, page: { id: page.id, label: page.label, icon: page.icon } })] : [];
  });
};

export { hubLiveGroups };
