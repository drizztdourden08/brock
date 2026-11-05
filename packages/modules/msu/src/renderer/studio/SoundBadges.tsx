/* @layer renderer-shell @kind component */
import { Status } from '@drizztdourden08/tessera/primitives';
import { useMsuStudioGame } from '../game/useMsuStudioGame';
import { roleInfo } from './behavior/role-info';
import type { SoundBadgesProps } from './SoundBadges.type';

const SoundBadges = (props: SoundBadgesProps) => {
  const { row, chipAudible } = props;
  const { layerCount, role, unreachable } = row;
  const game = useMsuStudioGame<never, never>();
  const replaced = layerCount > 0;
  const info = role === null ? null : roleInfo(game, role);

  return (
    <>
      {info !== null && (
        <Status tone="neutral" title={info.hint}>{info.label}</Status>
      )}
      {unreachable && (
        <Status tone="warning" title="Nothing in the game writes this id, so a sound put here never plays">
          Never raised
        </Status>
      )}

      <Status tone={replaced ? 'success' : 'neutral'}>{replaced ? 'Replaced' : 'Native'}</Status>
      {layerCount > 1 && <Status tone="neutral">{layerCount} layers</Status>}
      {chipAudible === false && !replaced && <Status tone="neutral">Silent</Status>}
    </>
  );
};

export { SoundBadges };
