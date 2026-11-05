/* @layer renderer-shell @kind logic */
import { useRandomizerGameStore } from '../../game-registry/behavior/useRandomizerGameStore';
import type { ArchipeliaContext } from './archipelia-context.type';

const registeredArchipelia = (): ArchipeliaContext | null => {
  const archipelago = useRandomizerGameStore.getState().game?.archipelago;
  const archipelia = archipelago?.archipelia;
  return archipelago === undefined || archipelia === undefined ? null : { archipelia, game: archipelago.name };
};

export { registeredArchipelia };
