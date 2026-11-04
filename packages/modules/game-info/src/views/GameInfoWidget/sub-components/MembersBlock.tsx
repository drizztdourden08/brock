/* @layer renderer-shell @kind component */
import { Badge, ProgressBar, Text } from '@drizztdourden08/tessera/primitives';
import type { MembersBlock as MembersBlockData } from '../../../provider/block.type';

interface MembersBlockProps {
  block: MembersBlockData;
}

const MembersBlock = ({ block }: MembersBlockProps) => (
  <div className="game-info-members">
    {block.members.map((member, index) => (
      <div key={index} className="game-info-member">
        <div className="game-info-member-head">
          <Text variant="label">{member.name}</Text>
          {member.badge && <Badge variant="inline" value={member.badge} />}
          {member.level !== undefined && <Text tone="faint">{`Lv ${member.level}`}</Text>}
        </div>
        {member.bars.map((bar) => (
          <ProgressBar key={bar.label} label={bar.label} value={bar.current} max={bar.max} showValue />
        ))}
      </div>
    ))}
  </div>
);

export { MembersBlock };
