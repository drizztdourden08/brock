/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import { SegmentedControl, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { groupsOf } from '../../options/behavior/groups-of';
import { OptionGroupList } from '../../options/OptionGroupList';
import { changedTextOf } from './behavior/changed-text-of';
import type { OptionScope } from './behavior/option-scope.type';
import { runFactsOf } from './behavior/run-facts-of';
import { runValuesOf } from './behavior/run-values-of';
import { scopedOptionsOf } from './behavior/scoped-options-of';
import { RUN_TITLE, SCOPE_OPTIONS, SCOPE_TITLES } from './ProfileRandomizerTab.constants';
import type { ProfileRandomizerTabProps } from './ProfileRandomizerTab.type';
import { FactsSection } from './sub-components/FactsSection';

const ProfileRandomizerTab = ({ randomizer }: ProfileRandomizerTabProps) => {
  const text = useText();
  const game = useRandomizerGame();
  const [scope, setScope] = useState<OptionScope>('changed');
  const catalog = game?.catalog ?? [];
  const values = runValuesOf(catalog, randomizer.options);
  const changed = scopedOptionsOf(catalog, values, 'changed').length;
  const shown = scopedOptionsOf(catalog, values, scope);

  return (
    <Stack gap="lg">
      <FactsSection title={text(RUN_TITLE)} facts={runFactsOf(randomizer, text, game?.labels?.modes?.[randomizer.mode])} />
      <Stack gap="sm">
        <Text variant="subtitle">{text(SCOPE_TITLES[scope])}</Text>
        <Text variant="caption" tone="muted">{changedTextOf(changed, text)}</Text>
        <SegmentedControl size="sm" value={scope} options={SCOPE_OPTIONS.map((option) => ({ ...option, label: text(option.label) }))} onChange={setScope} />
        <OptionGroupList groups={groupsOf(shown)} valueOf={(option) => values[option.key] ?? ''} readout />
      </Stack>
    </Stack>
  );
};

export { ProfileRandomizerTab };
