/* @layer renderer-shell @kind component */
import { Flex, Status } from '@drizztdourden08/tessera/primitives';
import type { DeviceBadgesProps } from './DeviceBadges.type';

const DeviceBadges = (props: DeviceBadgesProps) => {
  const { entry } = props;
  const { deviceKey, sdlType, connectionState, busType, hasRumble, hasGyro } = entry;
  const link = connectionState && connectionState !== 'unknown' ? connectionState : busType;

  return (
    <Flex gap="xs" wrap>
      <Status tone="neutral">{deviceKey}</Status>
      {sdlType && sdlType !== 'unknown' && <Status tone="neutral">{sdlType}</Status>}
      {link !== 'unknown' && <Status tone="neutral">{link}</Status>}
      {hasRumble && <Status tone="success">rumble</Status>}
      {hasGyro && <Status tone="success">gyro</Status>}
    </Flex>
  );
};

export { DeviceBadges };
