/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import type { ScoutedInput, ScoutedLocation } from '../client/online-host.type';
import type { ApNetworkItem } from '../protocol/protocol.type';

const scoutedInputOf = (ctx: OnlineContext, locations: readonly ApNetworkItem[]): ScoutedInput => {
  const { room, names } = ctx;
  const scouted: ScoutedLocation[] = [];
  for (const entry of locations) {
    const name = names.locationName(entry.location, room.slot ?? 0);
    const locationKey = ctx.deps.locationKeyOf(entry.location, name);
    if (locationKey === null) continue;
    scouted.push({
      location: entry.location,
      item: entry.item,
      player: entry.player,
      flags: entry.flags,
      itemName: names.itemName(entry.item, entry.player),
      gameName: names.gameOf(entry.player) ?? '',
      locationKey,
    });
  }
  return { seedName: room.roomInfo?.seed_name ?? '', slot: room.slot ?? 0, team: room.team ?? 0, scouted };
};

export { scoutedInputOf };
