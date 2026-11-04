/* @layer core @kind logic */
import type { ArchipelagoSocket } from '../protocol/socket.type';

const createBrowserSocket = (url: string): ArchipelagoSocket => {
  const ws = new WebSocket(url);
  return {
    send(text) {
      ws.send(text);
    },
    close() {
      ws.close();
    },
    onOpen(f) {
      ws.onopen = () => {
        f();
      };
    },
    onMessage(f) {
      ws.onmessage = (event) => {
        f(String(event.data));
      };
    },
    onClose(f) {
      ws.onclose = (event) => {
        f(event.code);
      };
    },
  };
};

export { createBrowserSocket };
