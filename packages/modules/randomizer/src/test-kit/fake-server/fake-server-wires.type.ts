/* @layer core @kind types */
import type { ApClientPacket, ArchipelagoSocket } from '../../archipelago';
import type { FakeRoom } from './fake-server.type';

interface SocketHandlers {
  open: () => void;
  message: (text: string) => void;
  close: (code: number) => void;
}

interface FakeServerWires {
  room: FakeRoom;
  urls: string[];
  received: ApClientPacket[];
  open: Set<ArchipelagoSocket>;
  handlers: Map<ArchipelagoSocket, SocketHandlers>;
  trackerNames: Map<ArchipelagoSocket, string>;
  live: ArchipelagoSocket | null;
}

export type { FakeServerWires, SocketHandlers };
