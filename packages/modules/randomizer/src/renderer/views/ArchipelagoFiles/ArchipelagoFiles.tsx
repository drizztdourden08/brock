/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Button, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useSaveArchipelagoFiles } from './behavior/useSaveArchipelagoFiles';
import { SAVE_LABEL } from './ArchipelagoFiles.constants';
import type { ArchipelagoFilesProps } from './ArchipelagoFiles.type';

const ArchipelagoFiles = (props: ArchipelagoFilesProps) => {
  const text = useText();
  const { saving, feedback, save } = useSaveArchipelagoFiles(props);

  return (
    <Stack gap="xs">
      <Button variant="secondary" size="sm" onClick={() => { void save(); }} disabled={saving}>{text(SAVE_LABEL)}</Button>
      {feedback && <Text tone={feedback.tone === 'error' ? 'danger' : 'muted'}>{feedback.text}</Text>}
    </Stack>
  );
};

export { ArchipelagoFiles };
