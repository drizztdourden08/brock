/* @layer renderer-shell @kind component */
import { useT, useText } from '@drizztdourden08/brock-react';
import { useEffect, useState } from 'react';
import { Box, Field, TextInput } from '@drizztdourden08/tessera/primitives';
import { useMsuStudio } from '../game/useMsuStudio';
import { withSoundGroup } from './behavior/sound-manifest';
import { HINT } from './SoundGroupField.constants';
import type { SoundGroupFieldProps } from './SoundGroupField.type';

const SoundGroupField = (props: SoundGroupFieldProps) => {
  const { pack, channel, soundId, group, saveBase, disabled = false, onSaved } = props;
  const t = useT();
  const text = useText();
  const { store } = useMsuStudio();
  const [draft, setDraft] = useState(group ?? '');

  useEffect(() => { setDraft(group ?? ''); }, [group]);

  const commit = (): void => {
    const wanted = draft.trim();
    if (wanted === (group ?? '')) return;
    void store.writeMsuManifest(pack, withSoundGroup(saveBase, channel, soundId, wanted)).then(onSaved);
  };

  return (
    <Box className="msu-sound-group">
      <Field label={t('msu:ui.group')} hint={text(HINT)}>
        <TextInput
          type="text"
          placeholder={t('msu:ui.groupPlaceholder')}
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }}
        />
      </Field>
    </Box>
  );
};

export { SoundGroupField };
