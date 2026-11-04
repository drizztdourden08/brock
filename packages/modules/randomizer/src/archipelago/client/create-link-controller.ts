/* @layer core @kind logic */
import { createReconnector } from '../reconnect/reconnector';
import type { ClientKit } from './client-kit.type';
import type { LinkController } from './link-controller.type';
import { MS_PER_SECOND } from './create-link-controller.constants';
import { makeCleanup } from './make-cleanup';
import { makeCloseHandler } from './make-close-handler';
import { makeConnect } from './make-connect';
import type { OnlineContext } from './online-context.type';

const createLinkController = (kit: ClientKit, getContext: () => OnlineContext): LinkController => {
  const { state } = kit;
  let reason = '';
  const connect = (): void => attempt();
  const reconnector = createReconnector(connect, (delay) => {
    kit.log(`[Online] ${reason}, retrying in ${Math.round(delay / MS_PER_SECOND)}s`, 'warn');
  });
  const onClose = makeCloseHandler(kit, reconnector, (next) => {
    reason = next;
  });
  const attempt = makeConnect(kit, getContext, onClose, reconnector);
  const cleanup = makeCleanup(kit, reconnector);

  return {
    begin() {
      reconnector.reset();
      attempt();
    },
    markConnected() {
      const { room } = kit;
      reconnector.reset();
      state.everConnected = true;
      const slotName = state.connection?.slotName ?? '';
      kit.log(`[Online] Connected as ${slotName} (slot ${room.slot ?? 0}, team ${room.team ?? 0})`);
      kit.notifyConnection({ state: 'connected', slotName });
      kit.emit({ type: 'connected', slotName, url: state.workingUrl ?? '' });
    },
    fail(message, logLine = message) {
      if (state.failed || state.stopped) return;
      state.failed = true;
      kit.log(logLine, 'error');
      reconnector.stop();
      kit.deps.host.pausePolling();
      kit.network.refused();
      kit.notifyConnection({ state: 'refused', error: message });
      kit.emit({ type: 'disconnected', reason: message });
      state.link?.close();
    },
    close: cleanup,
  };
};

export { createLinkController };
