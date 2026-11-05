/* @layer renderer-shell @kind logic */
import type { LobbyStart } from '../../../archipelago/lobby';
import type { RandomizerProfileConfig } from '../../../augment';
import { roomUrlsOf } from './room-urls-of';

const promotionOf = (config: RandomizerProfileConfig, start: LobbyStart, lobbyServer: string): RandomizerProfileConfig => {
  const { password: _old, fallbackServerUrl: _oldFallback, ...rest } = config;
  const { room, slots } = start;
  return {
    ...rest,
    mode: 'online',
    origin: 'archipelia',
    ...roomUrlsOf(lobbyServer, room),
    slotName: slots[0]?.name ?? config.slotName,
    ...(room.password === undefined || room.password === '' ? {} : { password: room.password }),
  };
};

export { promotionOf };
