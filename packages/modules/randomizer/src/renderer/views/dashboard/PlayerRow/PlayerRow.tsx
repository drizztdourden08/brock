/* @layer renderer-shell @kind component */
import { StatRow, Status } from '@drizztdourden08/tessera/primitives';
import type { PlayerRowProps } from './PlayerRow.type';

const PlayerRow = ({ player }: PlayerRowProps) => (
  <StatRow
    label={player.game === '' ? player.name : `${player.name} (${player.game})`}
    value={<Status tone={player.online ? 'success' : 'neutral'} dot>{player.status}</Status>}
  />
);

export { PlayerRow };
