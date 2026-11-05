/* @layer renderer-shell @kind component */
import { PasswordInput } from '@drizztdourden08/tessera/composites';
import { Button, Field, Grid, Stack, Text, TextInput, Toggle } from '@drizztdourden08/tessera/primitives';
import { textPatch } from '../../../behavior/text-patch';
import { useServerCheck } from '../../../behavior/useServerCheck';
import { CONNECTION_TEXT, CONNECTION_TEXT_FIELDS } from './ServerFields.constants';
import type { ServerFieldsProps } from './ServerFields.type';

const ServerFields = ({ value, onChange }: ServerFieldsProps) => {
  const { phase, message, check } = useServerCheck(value);
  return (
    <Stack gap="md">
      <Grid columns={2} gap="md">
        {CONNECTION_TEXT_FIELDS.map((key) => (
          <Field key={key} label={CONNECTION_TEXT[key]}>
            <TextInput type="text" value={value[key]} onChange={(e) => onChange(textPatch(key, e.target.value))} />
          </Field>
        ))}
        <Field label={CONNECTION_TEXT.password}>
          <PasswordInput value={value.password} onChange={(password) => onChange({ password })} />
        </Field>
      </Grid>
      <Toggle label={CONNECTION_TEXT.deathLink} checked={value.deathLink} onChange={(deathLink) => onChange({ deathLink })} />
      <Stack gap="sm">
        <Button variant="secondary" size="sm" onClick={check} loading={phase === 'checking'} disabled={phase === 'checking'}>
          {CONNECTION_TEXT.check}
        </Button>
        {message !== null && <Text variant="caption">{message}</Text>}
      </Stack>
    </Stack>
  );
};

export { ServerFields };
