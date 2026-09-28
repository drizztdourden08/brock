/* @layer renderer-shell @kind component */
import { Badge, Flex } from '@drizztdourden08/tessera/primitives';
import type { DeviceBadgesProps } from './DeviceBadges.type';

const DeviceBadges = (props: DeviceBadgesProps) => {
  const { entry } = props;
  const { deviceKey, sdlType, connectionState, busType, hasRumble, hasGyro } = entry;
  const link = connectionState && connectionState !== 'unknown' ? connectionState : busType;

  return (
    <Flex gap="xs" wrap>
      <Badge variant="neutral">{deviceKey}</Badge>
      {sdlType && sdlType !== 'unknown' && <Badge variant="neutral">{sdlType}</Badge>}
      {link !== 'unknown' && <Badge variant="neutral">{link}</Badge>}
      {hasRumble && <Badge variant="success">rumble</Badge>}
      {hasGyro && <Badge variant="success">gyro</Badge>}
    </Flex>
  );
};

export { DeviceBadges };
