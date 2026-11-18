/* @layer renderer-shell @kind component */
import { useState } from 'react';
import { Box, Button } from '@drizztdourden08/tessera/primitives';
import { CodeBlock } from '@drizztdourden08/tessera/composites';
import { useT } from '../../../i18n';
import type { DiagnosticsPreviewProps } from './DiagnosticsPreview.type';

const DiagnosticsPreview = (props: DiagnosticsPreviewProps) => {
  const { text } = props;
  const [shown, setShown] = useState(false);
  const t = useT();

  return (
    <Box className="bug-report__diagnostics">
      <Button variant="tertiary" size="sm" onClick={() => setShown(!shown)}>
        {t(shown ? 'brock-app:bugReport.diagnostics.hide' : 'brock-app:bugReport.diagnostics.show')}
      </Button>
      {shown && <CodeBlock className="bug-report__diagnostics-text" code={text ?? t('brock-app:bugReport.diagnostics.collecting')} language="text" wrap capped />}
    </Box>
  );
};

export { DiagnosticsPreview };
