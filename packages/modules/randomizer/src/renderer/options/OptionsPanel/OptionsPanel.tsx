/* @layer renderer-shell @kind component */
import { useRef } from 'react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { OptionsPanel as TabbedPanel } from '@drizztdourden08/tessera/composites';
import { useOptionTab } from '../behavior/useOptionTab';
import { useAsideTab } from './behavior/useAsideTab';
import { useNarrow } from './behavior/useNarrow';
import { TabBody } from './sub-components/TabBody';
import { ASIDE_TAB_ID, NARROW_PANEL_WIDTH, NO_OPTIONS_TEXT } from './OptionsPanel.constants';
import type { OptionsPanelProps } from './OptionsPanel.type';

const OptionsPanel = ({ title, overrides, seed = '', mode, romFile, tab, onTabChange, onChange }: OptionsPanelProps) => {
  const frame = useRef<HTMLElement>(null);
  const narrow = useNarrow(frame, NARROW_PANEL_WIDTH);
  const { items, active, values, select } = useOptionTab(overrides, tab, onTabChange);
  const { Side, Body, extra, choose } = useAsideTab(narrow, select);
  if (!active) return <Text variant="caption">{NO_OPTIONS_TEXT}</Text>;
  const tabProps = { values, overrides, onChange, frozen: onChange === undefined, seed, mode, romFile };
  const tabs = [...items.map(({ id, label, badge }) => ({ id, label, badge })), ...extra];
  return (
    <Box ref={frame}>
      <TabbedPanel
        title={title}
        tabs={tabs}
        activeTab={Body ? ASIDE_TAB_ID : active.id}
        onTabChange={choose}
        aside={Side ? <Side {...tabProps} /> : undefined}
      >
        {Body ? <Body {...tabProps} /> : <TabBody tab={active} {...tabProps} />}
      </TabbedPanel>
    </Box>
  );
};

export { OptionsPanel };
