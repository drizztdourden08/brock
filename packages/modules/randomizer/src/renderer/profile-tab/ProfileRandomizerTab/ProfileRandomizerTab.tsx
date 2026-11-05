/* @layer renderer-shell @kind component */
import { useState } from 'react';
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
  const game = useRandomizerGame();
  const [scope, setScope] = useState<OptionScope>('changed');
  const catalog = game?.catalog ?? [];
  const values = runValuesOf(catalog, randomizer.options);
  const changed = scopedOptionsOf(catalog, values, 'changed').length;
  const shown = scopedOptionsOf(catalog, values, scope);

  return (
    <Stack gap="lg">
      <FactsSection title={RUN_TITLE} facts={runFactsOf(randomizer, game?.labels?.modes?.[randomizer.mode])} />
      <Stack gap="sm">
        <Text variant="subtitle">{SCOPE_TITLES[scope]}</Text>
        <Text variant="caption" tone="muted">{changedTextOf(changed)}</Text>
        <SegmentedControl size="sm" value={scope} options={SCOPE_OPTIONS} onChange={setScope} />
        <OptionGroupList groups={groupsOf(shown)} valueOf={(option) => values[option.key] ?? ''} readout />
      </Stack>
    </Stack>
  );
};

export { ProfileRandomizerTab };
