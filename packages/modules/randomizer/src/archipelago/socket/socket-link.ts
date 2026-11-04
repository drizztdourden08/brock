/* @layer core @kind logic */
import type { ArchipelagoSocket } from '../protocol/socket.type';
import type { CreateSocket, SocketLink, SocketLinkHandlers } from './socket-link.type';

const openSocketLink = (
  candidates: readonly string[],
  createSocket: CreateSocket,
  handlers: SocketLinkHandlers,
): SocketLink => {
  let current: ArchipelagoSocket | null = null;
  let closing = false;

  const tryAt = (index: number): void => {
    const url = candidates[index];
    if (url === undefined) return;
    const hasNext = index + 1 < candidates.length;
    let socket: ArchipelagoSocket;
    try {
      socket = createSocket(url);
    } catch {
      if (hasNext && !closing) tryAt(index + 1);
      else queueMicrotask(() => handlers.onClose(false));
      return;
    }
    let opened = false;
    current = socket;
    socket.onOpen(() => {
      opened = true;
      handlers.onOpen(url);
    });
    socket.onMessage((text) => handlers.onMessage(text));
    socket.onClose(() => {
      if (current !== socket) return;
      current = null;
      if (!opened && hasNext && !closing) tryAt(index + 1);
      else handlers.onClose(opened);
    });
  };

  if (candidates.length === 0) queueMicrotask(() => handlers.onClose(false));
  else tryAt(0);

  return {
    send(data) {
      try {
        current?.send(data);
      } catch {
        return undefined;
      }
    },
    close() {
      closing = true;
      if (current === null) return false;
      current.close();
      return true;
    },
  };
};

export { openSocketLink };
