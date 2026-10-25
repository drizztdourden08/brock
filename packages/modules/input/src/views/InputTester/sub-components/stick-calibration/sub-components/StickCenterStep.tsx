/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { NextRedoRow, SamplingProgress } from '../../calibration-parts';
import type { StickStepProps } from '../stick-calibration.type';
import { StickRawPreview } from './StickRawPreview';

const StickCenterStep = ({ cal, target }: StickStepProps) => {
  const { centerDone, centerProgress, centerValues, startCenter, goToRange, calibrateLeft, calibrateRight } = cal;
  const valuesClass = calibrateLeft && calibrateRight ? 'stick-cal__values stick-cal__values--pair' : 'stick-cal__values';

  return (
    <Box>
      <Text as="p" className="cal-wizard__para">
        <Text as="strong">Leave {target ? `the ${target} stick` : 'both sticks'} at rest.</Text>
      </Text>
      {!centerDone ? (
        <SamplingProgress progress={centerProgress} />
      ) : (
        <Box>
          <Box className={valuesClass}>
            {calibrateLeft && <Box>L Center: {centerValues.lx}, {centerValues.ly}</Box>}
            {calibrateRight && <Box>R Center: {centerValues.rx}, {centerValues.ry}</Box>}
          </Box>
          <NextRedoRow onNext={goToRange} onRedo={startCenter} />
        </Box>
      )}
      <StickRawPreview cal={cal} />
    </Box>
  );
};

export { StickCenterStep };
