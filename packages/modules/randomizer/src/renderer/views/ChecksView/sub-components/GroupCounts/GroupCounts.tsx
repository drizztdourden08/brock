/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Flex, Text } from '@drizztdourden08/tessera/primitives';
import { GROUP_COUNTS_TITLE } from '../../ChecksView.constants';
import type { GroupCountsProps } from './GroupCounts.type';

const GroupCounts = ({ counts }: GroupCountsProps) => {
  const text = useText();
  return (
    <Flex as="span" inline gap="xs" title={text(GROUP_COUNTS_TITLE)}>
      <Text tone="faint">{counts.checked}</Text>
      <Text tone="faint">/</Text>
      <Text tone="faint">{counts.available}</Text>
      <Text tone="faint">/</Text>
      <Text tone="faint">{counts.blocked}</Text>
    </Flex>
  );
};

export { GroupCounts };
