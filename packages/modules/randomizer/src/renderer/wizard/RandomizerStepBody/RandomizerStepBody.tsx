/* @layer renderer-shell @kind component */
import { Field, Grid, Select, Stack, TextInput, Toggle } from '@drizztdourden08/tessera/primitives';
import type { RandomizerModeId } from '../../../augment';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { modeOptions } from '../mode-options';
import { SEED_PLACEHOLDER } from './RandomizerStepBody.constants';
import type { RandomizerStepBodyProps } from './RandomizerStepBody.type';

const RandomizerStepBody = ({ value, onChange }: RandomizerStepBodyProps) => {
  const options = modeOptions(useRandomizerGame());
  return (
    <Stack gap="md">
      <Toggle label="Randomizer" checked={value.enabled} onChange={(enabled) => onChange({ enabled })} />
      {value.enabled && (
        <Grid columns={2} gap="md">
          <Field label="Seed">
            <TextInput type="text" placeholder={SEED_PLACEHOLDER} value={value.seed} onChange={(e) => onChange({ seed: e.target.value })} />
          </Field>
          <Field label="Mode">
            <Select value={value.mode} onChange={(mode) => onChange({ mode: mode as RandomizerModeId })} options={options} />
          </Field>
        </Grid>
      )}
    </Stack>
  );
};

export { RandomizerStepBody };
