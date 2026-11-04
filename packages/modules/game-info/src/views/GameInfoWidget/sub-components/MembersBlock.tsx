/* @layer renderer-shell @kind component */
import { Badge, Flex, ProgressBar, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { MembersBlockProps } from './MembersBlock.type';

const MembersBlock = ({ block }: MembersBlockProps) => (
  <Stack className="game-info-members" gap="sm">
    {block.members.map((member, index) => (
      <Stack key={index} className="game-info-member" gap="2xs">
        <Flex className="game-info-member-head" align="center" gap="xs">
          <Text variant="label">{member.name}</Text>
          {member.badge && <Badge variant="inline" value={member.badge} />}
          {member.level !== undefined && <Text tone="faint">{`Lv ${member.level}`}</Text>}
        </Flex>
        {member.bars.map((bar) => (
          <ProgressBar key={bar.label} label={bar.label} value={bar.current} max={bar.max} showValue />
        ))}
      </Stack>
    ))}
  </Stack>
);

export { MembersBlock };
