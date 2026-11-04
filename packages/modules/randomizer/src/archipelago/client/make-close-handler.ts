/* @layer core @kind logic */
import type { Reconnector } from '../reconnect/reconnector.type';
import { resetConnection } from '../room/reset-connection';
import type { ClientKit } from './client-kit.type';

const makeCloseHandler =
  (kit: ClientKit, reconnector: Reconnector, setReason: (reason: string) => void) =>
  (opened: boolean): void => {
    const { state, room, network } = kit;
    state.link = null;
    resetConnection(room);
    kit.deps.host.pausePolling();
    if (state.stopped || state.failed) return;
    if (!opened) state.workingUrl = null;
    const reason = opened ? 'Connection lost' : 'Could not reach the server';
    setReason(reason);
    state.closeReason = reason;
    network.retrying();
    kit.notifyConnection({ state: 'reconnecting' });
    kit.emit({ type: 'disconnected', reason });
    reconnector.schedule();
  };

export { makeCloseHandler };
