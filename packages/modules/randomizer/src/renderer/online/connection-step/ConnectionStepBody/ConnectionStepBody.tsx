/* @layer renderer-shell @kind component */
import { PasswordInput } from '@drizztdourden08/tessera/composites';
import { Button, Field, Grid, Stack, Text, TextInput, Toggle } from '@drizztdourden08/tessera/primitives';
import { useServerCheck } from '../behavior/useServerCheck';
import { CONNECTION_TEXT } from './ConnectionStepBody.constants';
import type { ConnectionStepBodyProps } from './ConnectionStepBody.type';

const ConnectionStepBody = ({ value, onChange }: ConnectionStepBodyProps) => {
  const { phase, message, check } = useServerCheck(value);
  return (
    <Stack gap="md">
      <Grid columns={2} gap="md">
        <Field label={CONNECTION_TEXT.host}>
          <TextInput type="text" value={value.host} onChange={(e) => onChange({ host: e.target.value })} />
        </Field>
        <Field label={CONNECTION_TEXT.port}>
          <TextInput type="text" value={value.port} onChange={(e) => onChange({ port: e.target.value })} />
        </Field>
        <Field label={CONNECTION_TEXT.slotName}>
          <TextInput type="text" value={value.slotName} onChange={(e) => onChange({ slotName: e.target.value })} />
        </Field>
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

export { ConnectionStepBody };
