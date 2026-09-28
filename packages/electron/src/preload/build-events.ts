/* @layer electron-main @kind logic */
import type { EventContract } from '@drizztdourden08/brock-core/augment';
import type { EventMap, EventApi } from '@drizztdourden08/brock-core/ipc';
import { subscribe } from './subscribe';

const buildEvents = <M extends EventMap>(map: M): EventApi<M> =>
  Object.fromEntries(
    Object.entries(map).map(([method, channel]) => [method, (cb: EventContract[keyof EventContract]) => subscribe(channel, cb as never)]),
  ) as unknown as EventApi<M>;

export { buildEvents };
