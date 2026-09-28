/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import type { InstanceBadgeProps } from './InstanceBadge.type';

const InstanceBadge = (props: InstanceBadgeProps) => {
  const { name } = props;
  return <Text className="titlebar__instance">{name}</Text>;
};

export { InstanceBadge };
