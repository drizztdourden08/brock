/* @layer renderer-shell @kind component */
import { Box, ScrollArea, Text } from '@drizztdourden08/tessera/primitives';
import type { ReleaseNotesProps } from '../UpdateDialog.type';

const ReleaseNotes = (props: ReleaseNotesProps) => {
  const { notes } = props;

  return (
    <Box className="update-dialog__notes">
      <Text as="h4" className="update-dialog__notes-title">Release Notes</Text>
      <ScrollArea className="update-dialog__notes-content">
        <Text as="p" className="update-dialog__notes-text">{notes}</Text>
      </ScrollArea>
    </Box>
  );
};

export { ReleaseNotes };
