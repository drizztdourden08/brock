/* @layer renderer-shell @kind component */
import { useRef } from 'react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { OptionsPanel as TabbedPanel } from '@drizztdourden08/tessera/composites';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { useOptionTab } from '../behavior/useOptionTab';
import { useAsideTab } from './behavior/useAsideTab';
import { useNarrow } from './behavior/useNarrow';
import { TabBody } from './sub-components/TabBody';
import { ASIDE_TAB_ID, ASIDE_TAB_LABEL, NARROW_PANEL_WIDTH, NO_OPTIONS_TEXT } from './OptionsPanel.constants';
import type { OptionsPanelProps } from './OptionsPanel.type';

const OptionsPanel = ({ title, overrides, seed = '', mode, romFile, tab, onTabChange, onChange }: OptionsPanelProps) => {
  const game = useRandomizerGame();
  const frame = useRef<HTMLElement>(null);
  const narrow = useNarrow(frame, NARROW_PANEL_WIDTH);
  const { items, active, values, select } = useOptionTab(overrides, tab, onTabChange);
  const Aside = game?.views?.optionsAside;
  const asideInTabs = narrow && Aside !== undefined;
  const asideTab = useAsideTab(asideInTabs, select);
  if (!active) return <Text variant="caption">{NO_OPTIONS_TEXT}</Text>;
  const tabProps = { values, overrides, onChange, frozen: onChange === undefined, seed, mode, romFile };
  const tabs = items.map(({ id, label, badge }) => ({ id, label, badge }));
  const asideLabel = game?.views?.optionsAsideLabel ?? ASIDE_TAB_LABEL;
  return (
    <Box ref={frame}>
      <TabbedPanel
        title={title}
        tabs={asideInTabs ? [...tabs, { id: ASIDE_TAB_ID, label: asideLabel }] : tabs}
        activeTab={asideTab.isAside ? ASIDE_TAB_ID : active.id}
        onTabChange={asideTab.choose}
        aside={Aside && !narrow ? <Aside {...tabProps} /> : undefined}
      >
        {asideTab.isAside && Aside ? <Aside {...tabProps} /> : <TabBody tab={active} {...tabProps} />}
      </TabbedPanel>
    </Box>
  );
};

export { OptionsPanel };
