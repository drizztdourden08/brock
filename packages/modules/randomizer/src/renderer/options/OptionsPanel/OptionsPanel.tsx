/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { OptionsPanel as TabbedPanel } from '@drizztdourden08/tessera/composites';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { useOptionTab } from '../behavior/useOptionTab';
import { TabBody } from './sub-components/TabBody';
import { NO_OPTIONS_TEXT } from './OptionsPanel.constants';
import type { OptionsPanelProps } from './OptionsPanel.type';

const OptionsPanel = ({ title, overrides, seed = '', onChange }: OptionsPanelProps) => {
  const game = useRandomizerGame();
  const { items, active, values, select } = useOptionTab(overrides);
  if (!active) return <Text variant="caption">{NO_OPTIONS_TEXT}</Text>;
  const tabProps = { values, overrides, onChange, frozen: onChange === undefined, seed };
  const Aside = game?.views?.optionsAside;
  return (
    <TabbedPanel
      title={title}
      tabs={items.map(({ id, label, badge }) => ({ id, label, badge }))}
      activeTab={active.id}
      onTabChange={select}
      aside={Aside ? <Aside {...tabProps} /> : undefined}
    >
      <TabBody tab={active} {...tabProps} />
    </TabbedPanel>
  );
};

export { OptionsPanel };
