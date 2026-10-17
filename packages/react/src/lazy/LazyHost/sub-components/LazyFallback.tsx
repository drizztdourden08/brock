/* @layer renderer-shell @kind component */
import { Box, Spinner } from '@drizztdourden08/tessera/primitives';
import { useScreenshotHold } from '../../../screenshot/useScreenshotHold';

const LazyFallback = () => {
  useScreenshotHold(true);
  return (
    <Box className="lazy-host" data-brock-loading="">
      <Spinner size="md" />
    </Box>
  );
};

export { LazyFallback };
