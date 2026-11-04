/* @layer core @kind logic */
import type { OnlineHost } from '../../archipelago';
import { hostCursor } from './host-cursor';
import { hostDelivery } from './host-delivery';
import { hostGameLink } from './host-game-link';
import { hostLifecycle } from './host-lifecycle';
import { hostPolling } from './host-polling';
import { hostScouted } from './host-scouted';
import type { OnlineParts } from './online-parts.type';

const createOnlineHost = <P, A>(parts: OnlineParts<P, A>): OnlineHost => ({
  ...hostLifecycle(parts),
  ...hostDelivery(parts),
  ...hostPolling(parts),
  ...hostScouted(parts),
  ...hostCursor(parts),
  ...hostGameLink(parts),
});

export { createOnlineHost };
