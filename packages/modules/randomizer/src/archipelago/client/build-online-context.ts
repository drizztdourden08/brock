/* @layer core @kind logic */
import type { ClientKit } from './client-kit.type';
import type { LinkController } from './link-controller.type';
import type { OnlineContext } from './online-context.type';

const buildOnlineContext = (kit: ClientKit, controller: LinkController): OnlineContext => {
  const { state, room, network } = kit;
  return {
    deps: kit.deps,
    host: kit.deps.host,
    game: kit.deps.game,
    room,
    names: kit.names,
    messages: kit.messages,
    goal: kit.goal,
    network,
    connection() {
      if (state.connection === null) throw new Error('no connection is open');
      return state.connection;
    },
    send: kit.send,
    log: kit.log,
    emit: kit.emit,
    fail: controller.fail,
    markConnected: controller.markConnected,
    isLive: () => !state.stopped && !state.failed && room.connected,
    setDeathLink: (enabled) => kit.deathLinks.set(enabled),
    bounced: (packet) => kit.deathLinks.handleBounced(packet),
  };
};

export { buildOnlineContext };
