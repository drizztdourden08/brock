/* @layer renderer-app @kind component */
import { useState } from 'react';
import { useUnsavedChanges } from '@drizztdourden08/brock-react';
import type { ScreenMeta, SubPageProps } from '@drizztdourden08/brock-react';
import { Button, ButtonRow, Field, Stack, TextInput } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: 'New save', icon: 'save', keywords: ['create', 'slot'] };

const SaveCreator = (props: SubPageProps) => {
  const { back } = props;
  const [name, setName] = useState('');
  const release = useUnsavedChanges(name.trim() !== '', 'A new save has a name that is not saved.');
  const done = () => {
    release();
    back();
  };
  return (
    <Stack>
      <Field label="Name" htmlFor="new-save-name">
        <TextInput id="new-save-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Name this save" />
      </Field>
      <ButtonRow>
        <Button variant="primary" onClick={done} disabled={name.trim() === ''}>Save</Button>
        <Button variant="ghost" onClick={back}>Cancel</Button>
      </ButtonRow>
    </Stack>
  );
};

export default SaveCreator;
export { meta };
