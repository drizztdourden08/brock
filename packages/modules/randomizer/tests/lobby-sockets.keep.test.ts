/* @layer core @kind test */
import { PassThrough } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';
import { createLobbySockets } from '../src/main/lobby-socket/create-lobby-sockets';
import type { LobbySocketPush } from '../src/main/lobby-socket/lobby-socket.type';
import type { LobbySocketEvent } from '../src/ipc/lobby-socket-event.type';

type FakeTransport = {
  listen: (listener: (event: { kind: 'close'; code: number }) => void) => void;
  send: (data: string) => void;
  close: () => void;
};

const transports = vi.hoisted((): FakeTransport[] => []);

vi.mock('@drizztdourden08/archipelia-lobby-protocol/node', () => ({
  createSocketTransport: (): FakeTransport => {
    const transport: FakeTransport = { listen: vi.fn(), send: vi.fn(), close: vi.fn() };
    transports.push(transport);
    return transport;
  },
}));

const flush = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, 0); });

const recorder = (): { events: LobbySocketEvent[]; push: LobbySocketPush } => {
  const events: LobbySocketEvent[] = [];
  return { events, push: (event) => { events.push(event); } };
};

describe('lobby sockets', { tags: ['critical'] }, () => {
  it('destroys a socket that opens after the page closed it', async () => {
    const socket = new PassThrough();
    const destroy = vi.spyOn(socket, 'destroy');
    const sockets = createLobbySockets(() => Promise.resolve(socket));
    const { events, push } = recorder();
    sockets.open(1, 'a', 'ws://lobby', push);
    sockets.close('a');
    await flush();
    expect(destroy).toHaveBeenCalled();
    expect(events).toEqual([]);
  });

  it('closes every socket of one owner and no other', async () => {
    const before = transports.length;
    const sockets = createLobbySockets(() => Promise.resolve(new PassThrough()));
    const { events, push } = recorder();
    sockets.open(1, 'a', 'ws://lobby', push);
    sockets.open(2, 'b', 'ws://lobby', push);
    await flush();
    sockets.closeOwnedBy(1);
    expect(events).toEqual([{ id: 'a', kind: 'open' }, { id: 'b', kind: 'open' }]);
    expect(transports[before]?.close).toHaveBeenCalledTimes(1);
    expect(transports[before + 1]?.close).not.toHaveBeenCalled();
  });

  it('pushes an error then close 1006 when the upgrade fails', async () => {
    const sockets = createLobbySockets(() => Promise.reject(new Error('refused')));
    const { events, push } = recorder();
    sockets.open(1, 'a', 'ws://lobby', push);
    await flush();
    expect(events).toEqual([{ id: 'a', kind: 'error' }, { id: 'a', kind: 'close', code: 1006 }]);
  });
});
