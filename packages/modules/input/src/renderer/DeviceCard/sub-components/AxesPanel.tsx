/* @layer renderer-shell @kind component */
import { Button, Flex } from '@drizztdourden08/tessera/primitives';
import { StickView } from './StickView';
import { TriggerView } from './TriggerView';
import type { AxesPanelProps } from './AxesPanel.type';

const AxesPanel = (props: AxesPanelProps) => {
  const { sticks, triggers, hasAxis, onCalibrate } = props;
  const presentSticks = sticks.filter((stick) => hasAxis[stick.xAxis] && hasAxis[stick.yAxis]);
  const presentTriggers = triggers.filter((trigger) => hasAxis[trigger.axisIndex]);

  return (
    <Flex gap="lg" align="start" wrap>
      {presentSticks.map(({ side, label, xAxis, yAxis, point, calibrated }) => (
        <Flex key={side} direction="column" align="center" gap="xs">
          <StickView label={label} point={point} calibrated={calibrated} />
          <Button variant="tertiary" size="sm" onClick={() => onCalibrate({ kind: 'stick', slot: { side, label, xAxis, yAxis } })}>
            Calibrate
          </Button>
        </Flex>
      ))}
      {presentTriggers.map(({ axisIndex, label, value, calibrated }) => (
        <Flex key={axisIndex} direction="column" gap="xs">
          <TriggerView label={label} value={value} calibrated={calibrated} />
          <Button variant="tertiary" size="sm" onClick={() => onCalibrate({ kind: 'trigger', slot: { axisIndex, label } })}>
            Calibrate
          </Button>
        </Flex>
      ))}
    </Flex>
  );
};

export { AxesPanel };
