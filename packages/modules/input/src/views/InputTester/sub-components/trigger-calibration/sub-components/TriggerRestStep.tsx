/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { NextRedoRow, SamplingProgress } from '../../calibration-parts';
import type { TriggerRestStepProps } from '../trigger-calibration.type';
import { TriggerBar } from './TriggerBar';

const TriggerRestStep = ({ cal, label, axisIndex }: TriggerRestStepProps) => (
  <Box>
    <Text as="p" className="cal-wizard__para">
      <Text as="strong">Leave the {label} fully released.</Text>
    </Text>

    {!cal.restDone ? (
      <SamplingProgress progress={cal.restProgress} />
    ) : (
      <Box>
        <Box className="cal-wizard__value-box">
          Rest value: {cal.baseValue.toFixed(3)}
        </Box>
        <NextRedoRow onNext={cal.advanceToMax} onRedo={cal.resetRest} />
      </Box>
    )}

    <Box className="trigger-cal__bar-row">
      <TriggerBar value={cal.rawValue} label={`${label} (raw)`} step={cal.step} deadzone={cal.deadzone} />
      <Box className="trigger-cal__mono">
        <Box>axis[{axisIndex}]: {cal.rawValue.toFixed(4)}</Box>
        {cal.rawByte !== null && <Box>byte: {cal.rawByte} (0x{cal.rawByte.toString(16).padStart(2, '0')})</Box>}
      </Box>
    </Box>
  </Box>
);

export { TriggerRestStep };
