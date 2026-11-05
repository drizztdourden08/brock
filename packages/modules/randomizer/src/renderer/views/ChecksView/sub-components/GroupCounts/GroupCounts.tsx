/* @layer renderer-shell @kind component */
import { Flex, Text } from '@drizztdourden08/tessera/primitives';
import type { GroupCountsProps } from './GroupCounts.type';

const GroupCounts = ({ counts }: GroupCountsProps) => (
  <Flex as="span" inline gap="xs" title="checked / available / blocked">
    <Text tone="faint">{counts.checked}</Text>
    <Text tone="faint">/</Text>
    <Text tone="faint">{counts.available}</Text>
    <Text tone="faint">/</Text>
    <Text tone="faint">{counts.blocked}</Text>
  </Flex>
);

export { GroupCounts };
