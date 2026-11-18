/* @layer renderer-app @kind component */
import { useState } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useT, useUnsavedChanges } from '@drizztdourden08/brock-react';
import type { ScreenMeta, SubPageProps } from '@drizztdourden08/brock-react';
import { Button, ButtonRow, Field, Stack, TextInput } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: msg('app:saves.new.title'), icon: 'save', keywords: ['create', 'slot'] };

const SaveCreator = (props: SubPageProps) => {
  const { back } = props;
  const t = useT();
  const [name, setName] = useState('');
  const release = useUnsavedChanges(name.trim() !== '', t('app:saves.new.unsaved'));
  const done = () => {
    release();
    back();
  };
  return (
    <Stack>
      <Field label={t('app:saves.new.name')} htmlFor="new-save-name">
        <TextInput id="new-save-name" value={name} onChange={(event) => setName(event.target.value)} placeholder={t('app:saves.new.placeholder')} />
      </Field>
      <ButtonRow>
        <Button variant="primary" onClick={done} disabled={name.trim() === ''}>{t('app:saves.new.save')}</Button>
        <Button variant="ghost" onClick={back}>{t('app:saves.new.cancel')}</Button>
      </ButtonRow>
    </Stack>
  );
};

export default SaveCreator;
export { meta };
