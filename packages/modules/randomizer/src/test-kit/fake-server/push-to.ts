/* @layer core @kind logic */
import type { ApServerPacket, ArchipelagoSocket } from '../../archipelago';
import type { FakeServerWires } from './fake-server-wires.type';

const pushTo = (wires: FakeServerWires, socket: ArchipelagoSocket, packets: ApServerPacket[]): void => {
  queueMicrotask(() => {
    if (wires.open.has(socket)) wires.handlers.get(socket)?.message(JSON.stringify(packets));
  });
};

export { pushTo };
