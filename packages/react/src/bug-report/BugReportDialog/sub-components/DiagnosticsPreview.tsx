/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { Box, Button } from '@drizztdourden08/tessera/primitives';
import { CodeBlock } from '@drizztdourden08/tessera/composites';
import type { DiagnosticsPreviewProps } from './DiagnosticsPreview.type';

const DiagnosticsPreview = (props: DiagnosticsPreviewProps) => {
  const { text } = props;
  const [shown, setShown] = useState(false);

  return (
    <Box className="bug-report__diagnostics">
      <Button variant="tertiary" size="sm" onClick={() => setShown(!shown)}>
        {shown ? 'Hide diagnostics' : 'Show diagnostics'}
      </Button>
      {shown && <CodeBlock className="bug-report__diagnostics-text" code={text ?? 'Collecting...'} language="text" wrap capped />}
    </Box>
  );
};

export { DiagnosticsPreview };
