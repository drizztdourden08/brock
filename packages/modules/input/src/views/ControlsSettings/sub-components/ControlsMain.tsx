/* @layer renderer-components @kind component */
import { useMemo } from 'react';
import { Box, ScrollArea, Tabs } from '@drizztdourden08/tessera/primitives';
import type { TabItem } from '@drizztdourden08/tessera/primitives';
import type { ControlsTabDef } from '../ControlsSettings.type';
import { ActionsTab } from './ActionsTab';
import { OptionsTab } from './OptionsTab';
import { VerbsTab } from './VerbsTab';
import type { ControlsCtrl, ControlsMainProps } from './ControlsMain.type';

const tabItem = (tab: ControlsTabDef): TabItem => ({
  id: tab.id,
  label: tab.label,
  disabled: Boolean(tab.disabledReason),
  disabledReason: tab.disabledReason ?? undefined,
});

const renderTab = (tab: ControlsTabDef, ctrl: ControlsCtrl) => {
  switch (tab.kind) {
    case 'actions':
      return <ActionsTab tab={tab} ctrl={ctrl} />;
    case 'verbs':
      return <VerbsTab tab={tab} ctrl={ctrl} />;
    case 'options':
      return <OptionsTab tab={tab} ctrl={ctrl} />;
    case 'custom':
      return tab.render(ctrl.context);
  }
};

const ControlsMain = ({ tabs, ctrl }: ControlsMainProps) => {
  const items = useMemo(() => tabs.map(tabItem), [tabs]);
  return (
    <Box className="controls-settings__main">
      <Tabs tabs={items} activeTab={ctrl.activeId} onTabChange={ctrl.setActiveTab} />
      <ScrollArea className="controls-settings__body">{ctrl.activeTab ? renderTab(ctrl.activeTab, ctrl) : null}</ScrollArea>
    </Box>
  );
};

export { ControlsMain };
