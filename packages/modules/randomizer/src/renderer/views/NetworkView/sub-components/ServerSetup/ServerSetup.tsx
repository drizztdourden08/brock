/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { PasswordInput } from '@drizztdourden08/tessera/composites';
import { Button, Card, Field, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { useServerSetupForm } from '../../behavior/useServerSetupForm';
import { APPLY_LABEL, PASSWORD_LABEL, SETUP_TITLE, SLOT_LABEL, URL_LABEL, URL_PLACEHOLDER } from './ServerSetup.constants';

const ServerSetup = () => {
  const text = useText();
  const { draft, set, slotError, canApply, applyError, apply } = useServerSetupForm();

  return (
    <Card title={text(SETUP_TITLE)}>
      <Stack gap="sm">
        <Field label={text(URL_LABEL)}>
          <TextInput value={draft.serverUrl} placeholder={URL_PLACEHOLDER} onChange={(event) => set('serverUrl', event.target.value)} />
        </Field>
        <Field label={text(SLOT_LABEL)} error={slotError}>
          <TextInput value={draft.slotName} invalid={slotError !== null} onChange={(event) => set('slotName', event.target.value)} />
        </Field>
        <Field label={text(PASSWORD_LABEL)}>
          <PasswordInput value={draft.password} onChange={(value) => set('password', value)} />
        </Field>
        <Button variant="primary" disabled={!canApply} onClick={apply}>{text(APPLY_LABEL)}</Button>
        {applyError !== null && <Text variant="caption">{applyError}</Text>}
      </Stack>
    </Card>
  );
};

export { ServerSetup };
