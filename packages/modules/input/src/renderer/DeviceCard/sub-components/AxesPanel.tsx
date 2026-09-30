/* @layer renderer-shell @kind component */
import { StickPlot } from '@drizztdourden08/tessera/composites';
import { Button, Flex, ProgressBar, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import type { AxesPanelProps } from './AxesPanel.type';

const AxesPanel = (props: AxesPanelProps) => {
  const { sticks, triggers, hasAxis, onCalibrate } = props;
  const presentSticks = sticks.filter((stick) => hasAxis[stick.xAxis] && hasAxis[stick.yAxis]);
  const presentTriggers = triggers.filter((trigger) => hasAxis[trigger.axisIndex]);

  return (
    <Flex gap="lg" align="start" wrap>
      {presentSticks.map(({ side, label, xAxis, yAxis, point, calibrated }) => (
        <Flex key={side} direction="column" align="center" gap="xs">
          <StickPlot x={point.x} y={point.y} label={label} calibrated={calibrated} />
          <Button variant="tertiary" size="sm" onClick={() => onCalibrate({ kind: 'stick', slot: { side, label, xAxis, yAxis } })}>
            Calibrate
          </Button>
        </Flex>
      ))}
      {presentTriggers.map(({ axisIndex, label, value, calibrated }) => (
        <Stack key={axisIndex} gap="xs" className="device-card__trigger">
          <StatRow label={label} value={`${value.toFixed(2)}${calibrated ? ' cal' : ''}`} mono />
          <ProgressBar value={value} max={1} live />
          <Button variant="tertiary" size="sm" onClick={() => onCalibrate({ kind: 'trigger', slot: { axisIndex, label } })}>
            Calibrate
          </Button>
        </Stack>
      ))}
    </Flex>
  );
};

export { AxesPanel };
