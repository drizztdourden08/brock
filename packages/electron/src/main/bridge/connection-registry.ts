/* @layer electron-main @kind logic */
import type { BridgeConnectionLink, BridgeConnectionListener, BridgeServer } from './bridge.type';

const listenerSet = () => {
  const listeners = new Set<BridgeConnectionListener>();
  return {
    add: (listener: BridgeConnectionListener): (() => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    fire: (connectionId: string): void => {
      for (const listener of [...listeners]) listener(connectionId);
    },
  };
};

const connectionRegistry = (maxClients: number) => {
  const links = new Map<string, BridgeConnectionLink>();
  const opened = listenerSet();
  const closed = listenerSet();
  const state = { next: 1 };
  const emitTo: BridgeServer['emitTo'] = (connectionId, event, ...args) => links.get(connectionId)?.push(event.channel, args) ?? false;
  const emit: BridgeServer['emit'] = (event, ...args) => [...links.values()].filter((link) => link.push(event.channel, args)).length;
  return {
    admit: (link: BridgeConnectionLink): string | null => {
      if (links.size >= maxClients) return null;
      const connectionId = `c${state.next}`;
      state.next += 1;
      links.set(connectionId, link);
      opened.fire(connectionId);
      return connectionId;
    },
    release: (connectionId: string): void => {
      if (links.delete(connectionId)) closed.fire(connectionId);
    },
    onOpen: opened.add,
    onClose: closed.add,
    connections: (): string[] => [...links.keys()],
    emitTo,
    emit,
  };
};

export { connectionRegistry };
