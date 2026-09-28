/* @layer renderer-shell @kind component */
import { Flex, ProgressBar, Text } from '@drizztdourden08/tessera/primitives';
import type { TriggerViewProps } from './TriggerView.type';
import './TriggerView.css';

const TriggerView = (props: TriggerViewProps) => {
  const { label, value, calibrated } = props;

  return (
    <Flex direction="column" gap="xs" className="trigger-view">
      <Flex justify="between" align="center">
        <Text className="trigger-view__label">{label}</Text>
        <Text className="trigger-view__value">{`${value.toFixed(2)}${calibrated ? ' cal' : ''}`}</Text>
      </Flex>
      <ProgressBar value={value} max={1} live />
    </Flex>
  );
};

export { TriggerView };
