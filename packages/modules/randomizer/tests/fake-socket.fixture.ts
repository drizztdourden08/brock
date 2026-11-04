/* @layer core @kind test */
import type { ArchipelagoSocket } from '../src/archipelago/protocol/socket.type';

interface FakeSocket {
  socket: ArchipelagoSocket;
  url: string;
  sent: string[];
  closed: boolean;
  open(): void;
  receive(packets: readonly unknown[]): void;
  receiveText(text: string): void;
  drop(code?: number): void;
}

interface FakeSocketFactory {
  createSocket(url: string): ArchipelagoSocket;
  sockets: FakeSocket[];
  last(): FakeSocket;
  sentPackets(): unknown[];
}

const buildFakeSocket = (url: string): FakeSocket => {
  let onOpen: () => void = () => undefined;
  let onMessage: (text: string) => void = () => undefined;
  let onClose: (code: number) => void = () => undefined;
  const fake: FakeSocket = {
    url,
    sent: [],
    closed: false,
    socket: {
      send(text) {
        fake.sent.push(text);
      },
      close() {
        if (fake.closed) return;
        fake.closed = true;
        onClose(1000);
      },
      onOpen(f) {
        onOpen = f;
      },
      onMessage(f) {
        onMessage = f;
      },
      onClose(f) {
        onClose = f;
      },
    },
    open() {
      onOpen();
    },
    receive(packets) {
      onMessage(JSON.stringify(packets));
    },
    receiveText(text) {
      onMessage(text);
    },
    drop(code = 1006) {
      fake.closed = true;
      onClose(code);
    },
  };
  return fake;
};

const createFakeSocketFactory = (): FakeSocketFactory => {
  const sockets: FakeSocket[] = [];
  return {
    sockets,
    last() {
      const socket = sockets[sockets.length - 1];
      if (socket === undefined) throw new Error('no socket was created');
      return socket;
    },
    createSocket(url) {
      const fake = buildFakeSocket(url);
      sockets.push(fake);
      return fake.socket;
    },
    sentPackets() {
      return sockets.flatMap((fake) => fake.sent.map((text): unknown => JSON.parse(text)));
    },
  };
};

export { createFakeSocketFactory };
export type { FakeSocket, FakeSocketFactory };
