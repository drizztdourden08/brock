/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Field, Grid, Select, Stack, TextInput, Toggle } from '@drizztdourden08/tessera/primitives';
import type { RandomizerModeId } from '../../../augment';
import { useVisibleModes } from './behavior/useVisibleModes';
import { MODE_LABEL, SEED_LABEL, SEED_PLACEHOLDER, TOGGLE_LABEL } from './RandomizerStepBody.constants';
import type { RandomizerStepBodyProps } from './RandomizerStepBody.type';

const RandomizerStepBody = ({ value, onChange }: RandomizerStepBodyProps) => {
  const text = useText();
  const options = useVisibleModes(value.mode, onChange).map((option) => ({ value: option.value, label: text(option.label) }));
  return (
    <Stack gap="md">
      <Toggle label={text(TOGGLE_LABEL)} checked={value.enabled} onChange={(enabled) => onChange({ enabled })} />
      {value.enabled && (
        <Grid columns={2} gap="md">
          <Field label={text(SEED_LABEL)}>
            <TextInput type="text" placeholder={text(SEED_PLACEHOLDER)} value={value.seed} onChange={(e) => onChange({ seed: e.target.value })} />
          </Field>
          <Field label={text(MODE_LABEL)}>
            <Select value={value.mode} onChange={(mode) => onChange({ mode: mode as RandomizerModeId })} options={options} />
          </Field>
        </Grid>
      )}
    </Stack>
  );
};

export { RandomizerStepBody };
