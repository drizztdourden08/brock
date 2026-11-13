/* @layer renderer-components @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { NarrowPanelProps } from './NarrowPanel.type';

const NarrowPanel = ({ action, children }: NarrowPanelProps) => (
  <Box className="controls-settings__narrow-panel">
    <Box className="controls-settings__narrow-action">{action}</Box>
    {children}
  </Box>
);

export { NarrowPanel };
