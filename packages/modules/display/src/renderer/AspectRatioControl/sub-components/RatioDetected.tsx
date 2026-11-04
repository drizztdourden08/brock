/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { niceRatio } from '../../../aspect-ratio/index';
import type { RatioDetectedProps } from '../AspectRatioControl.type';

const RatioDetected = (props: RatioDetectedProps) => {
  const { detected, used, capped } = props;
  const nearDetected = niceRatio(detected);
  const nearUsed = niceRatio(used);
  return (
    <Box className="aspect-ratio-control__custom">
      <Text className="aspect-ratio-control__detected">{`Detected: ${nearDetected.w}:${nearDetected.h}`}</Text>
      <Text className={capped ? 'aspect-ratio-control__capped' : 'aspect-ratio-control__detected'}>
        {`Calculated: ${nearUsed.w}:${nearUsed.h}${capped ? ' (capped by the app limit)' : ''}`}
      </Text>
    </Box>
  );
};

export { RatioDetected };
