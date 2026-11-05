/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import '../ControllerPauseLayer.css';

const ManualPauseOverlay = () => (
  <Box className="controller-pause-layer">
    <Box className="controller-pause-layer__icon">
      <Box className="controller-pause-layer__bar" />
      <Box className="controller-pause-layer__bar" />
    </Box>
  </Box>
);

export { ManualPauseOverlay };
