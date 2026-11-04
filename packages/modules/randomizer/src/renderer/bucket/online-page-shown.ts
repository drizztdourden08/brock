/* @layer renderer-shell @kind logic */
import type { ShowContext } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';

const onlinePageShown = ({ profile, flags }: ShowContext): boolean => {
  const archipelago = useRandomizerGameStore.getState().game?.archipelago;
  if (profile?.randomizer?.mode !== 'online' || !archipelago) return false;
  const on = new Set(Object.keys(flags).filter((key) => Boolean(flags[key])));
  return archipelago.visible?.(on) !== false;
};

export { onlinePageShown };
