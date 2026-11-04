/* @layer core @kind logic */
import { dispatchMessage } from '../dispatch/dispatch-message';
import type { Reconnector } from '../reconnect/reconnector.type';
import { resetConnection } from '../room/reset-connection';
import { openSocketLink } from '../socket/socket-link';
import type { ClientKit } from './client-kit.type';
import { connectCandidates } from './connect-candidates';
import type { OnlineContext } from './online-context.type';

const makeConnect =
  (kit: ClientKit, getContext: () => OnlineContext, onClose: (opened: boolean) => void, reconnector: Reconnector) =>
  (): void => {
    const { state, network, room } = kit;
    const { connection } = state;
    if (connection === null || state.stopped || state.failed) return;
    reconnector.cancel();
    resetConnection(room);
    network.connecting();
    kit.notifyConnection({ state: 'connecting' });
    state.link = openSocketLink(connectCandidates(state), kit.createSocket, {
      onOpen: (url) => {
        state.workingUrl = url;
        kit.log(`[Online] Connecting to ${url}`);
        network.opened(url, connection);
      },
      onMessage: (text) => dispatchMessage(getContext(), text),
      onClose,
    });
  };

export { makeConnect };
