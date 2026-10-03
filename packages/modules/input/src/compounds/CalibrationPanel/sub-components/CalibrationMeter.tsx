/* @layer renderer-shell @kind component */
import { StickPlot } from '@drizztdourden08/tessera/composites';
import { ProgressBar, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import type { CalibrationMeterProps } from './CalibrationMeter.type';

const CalibrationMeter = (props: CalibrationMeterProps) => {
  const { reading } = props;

  if (reading.kind === 'stick') {
    const { x, y, center, range, innerDeadzone, outerDeadzone } = reading;
    return (
      <StickPlot
        x={x}
        y={y}
        size="lg"
        showValue={false}
        center={center}
        range={range}
        innerDeadzone={innerDeadzone}
        outerDeadzone={outerDeadzone}
        className="calibration-panel__stick"
      />
    );
  }

  const { label, value, peak } = reading;
  return (
    <Stack gap="xs" className="calibration-panel__trigger">
      <StatRow label={label} value={value.toFixed(2)} mono />
      <ProgressBar value={value} max={1} secondaryValue={peak} live />
    </Stack>
  );
};

export { CalibrationMeter };
