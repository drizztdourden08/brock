/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import type { BridgeConnectionLink, BridgeConnectionListener, BridgeServer } from './bridge.type';
import { BRIDGE_CONNECTION_ID_BYTES } from './bridge.constants';

const listenerSet = (label: string, report: (label: string, error: unknown) => void) => {
  const listeners = new Set<BridgeConnectionListener>();
  return {
    add: (listener: BridgeConnectionListener): (() => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    fire: (connectionId: string): void => {
      for (const listener of [...listeners]) {
        try {
          listener(connectionId);
        } catch (error) {
          report(label, error);
        }
      }
    },
  };
};

const connectionRegistry = (maxClients: number, report: (label: string, error: unknown) => void) => {
  const links = new Map<string, BridgeConnectionLink>();
  const opened = listenerSet('onOpen listener', report);
  const closed = listenerSet('onClose listener', report);
  const emitTo: BridgeServer['emitTo'] = (connectionId, event, ...args) => (links.get(connectionId)?.push(event.channel, args) ? 1 : 0);
  const emit: BridgeServer['emit'] = (event, ...args) => [...links.values()].filter((link) => link.push(event.channel, args)).length;
  return {
    admit: (link: BridgeConnectionLink): string | null => {
      if (links.size >= maxClients) return null;
      const connectionId = randomBytes(BRIDGE_CONNECTION_ID_BYTES).toString('hex');
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
