/* @layer core @kind logic */
import type { ForeignItem } from '../applier/foreign-item.type';
import type { OnlineParts } from './online-parts.type';

const foreignOf = <P, A>({ run, late }: OnlineParts<P, A>, locationKey: string): ForeignItem | undefined => {
  const entry = run.entriesByKey.get(locationKey);
  if (entry === undefined || entry.player === run.scouted?.slot) return undefined;
  const owner = late.client().status().players.find((player) => player.slot === entry.player);
  return {
    itemName: entry.itemName,
    playerName: owner?.name ?? `Player ${entry.player}`,
    gameName: entry.gameName,
    flags: entry.flags,
  };
};

export { foreignOf };
