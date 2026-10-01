/* @layer renderer-shell @kind component */
import { Card, Flex, Status, Text } from '@drizztdourden08/tessera/primitives';
import type { UnavailableDeviceProps } from './UnavailableDevice.type';

const UnavailableDevice = (props: UnavailableDeviceProps) => {
  const { entry } = props;

  return (
    <Card>
      <Flex direction="column" gap="xs">
        <Flex align="center" gap="sm" wrap>
          <Text variant="subtitle">{entry.product}</Text>
          <Status tone="warning">not opened</Status>
          <Status tone="neutral">{entry.deviceKey}</Status>
        </Flex>
        <Text variant="caption">
          The system sees this device but SDL could not open it. Another program may hold it, or it has no mapping yet.
        </Text>
      </Flex>
    </Card>
  );
};

export { UnavailableDevice };
