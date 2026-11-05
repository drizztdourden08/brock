/* @layer renderer-shell @kind logic */
import type { ShowContext } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { truthyFlagKeys } from '../truthy-flag-keys';
import { ONLINE_MODE } from '../online/online-mode.constants';

const onlinePageShown = ({ profile, flags }: ShowContext): boolean => {
  const archipelago = useRandomizerGameStore.getState().game?.archipelago;
  if (profile?.randomizer?.mode !== ONLINE_MODE || !archipelago) return false;
  return archipelago.visible?.(truthyFlagKeys(flags)) !== false;
};

export { onlinePageShown };
