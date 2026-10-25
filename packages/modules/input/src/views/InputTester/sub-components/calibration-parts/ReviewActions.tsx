/* @layer renderer-shell @kind component */
import { Box, Button } from '@drizztdourden08/tessera/primitives';
import type { ReviewActionsProps } from './calibration-parts.type';

const ReviewActions = ({ onSave, onBack, onStartOver }: ReviewActionsProps) => (
  <Box className="cal-wizard__actions cal-wizard__actions--wide">
    <Button variant="primary" size="sm" onClick={onSave}>Save Calibration</Button>
    <Button variant="tertiary" size="sm" onClick={onBack}>Back</Button>
    <Button variant="tertiary" size="sm" onClick={onStartOver}>Start Over</Button>
  </Box>
);

export { ReviewActions };
