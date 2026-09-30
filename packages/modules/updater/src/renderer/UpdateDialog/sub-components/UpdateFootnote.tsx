/* @layer renderer-shell @kind component */
import { BugReportButton } from '@drizztdourden08/brock-react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import type { UpdateFootnoteProps } from '../UpdateDialog.type';

const UpdateFootnote = (props: UpdateFootnoteProps) => {
  const { onReportBug } = props;

  return (
    <Box className="update-dialog__footnote">
      <Text as="p" className="update-dialog__footnote-text">
        Any earlier version can be picked above if something stops working. Please report it either way, so it gets fixed.
      </Text>
      <BugReportButton onBeforeOpen={onReportBug} />
    </Box>
  );
};

export { UpdateFootnote };
