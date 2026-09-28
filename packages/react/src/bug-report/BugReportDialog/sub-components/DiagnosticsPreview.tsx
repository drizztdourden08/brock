/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import type { DiagnosticsPreviewProps } from './DiagnosticsPreview.type';

const DiagnosticsPreview = (props: DiagnosticsPreviewProps) => {
  const { text } = props;
  const [shown, setShown] = useState(false);

  return (
    <Box className="bug-report__diagnostics">
      <Button variant="tertiary" size="sm" onClick={() => setShown(!shown)}>
        {shown ? 'Hide diagnostics' : 'Show diagnostics'}
      </Button>
      {shown && <Text as="pre" className="bug-report__diagnostics-text">{text ?? 'Collecting...'}</Text>}
    </Box>
  );
};

export { DiagnosticsPreview };
