/* @layer renderer-shell @kind component */
import { Box, Button } from '@drizztdourden08/tessera/primitives';
import type { NextRedoRowProps } from './calibration-parts.type';

const NextRedoRow = ({ onNext, onRedo }: NextRedoRowProps) => (
  <Box className="cal-wizard__row">
    <Button variant="primary" size="sm" onClick={onNext}>Next</Button>
    <Button variant="tertiary" size="sm" onClick={onRedo}>Redo</Button>
  </Box>
);

export { NextRedoRow };
