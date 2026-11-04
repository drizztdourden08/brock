/* @layer core @kind logic */
import type { Reconnector } from '../reconnect/reconnector.type';
import type { ClientKit } from './client-kit.type';

const makeCleanup =
  (kit: ClientKit, reconnector: Reconnector) =>
  (): void => {
    const { state, room, deps, network } = kit;
    if (state.connection === null) return;
    const wasFailed = state.failed;
    state.stopped = true;
    reconnector.stop();
    state.unsubscribeSwap?.();
    state.unsubscribeSwap = null;
    room.resyncWait?.();
    room.resyncWait = null;
    kit.deathLinks.dispose();
    deps.host.cancelDeliveries();
    deps.host.pausePolling();
    deps.host.disarm();
    state.link?.close();
    state.link = null;
    state.connection = null;
    if (wasFailed) return;
    network.stop();
    kit.log('[Online] Session closed');
    kit.notifyConnection({ state: 'closed' });
    kit.emit({ type: 'disconnected', reason: 'Session closed' });
  };

export { makeCleanup };
