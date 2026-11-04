/* @layer core @kind types */
import type { ReceivedCursor } from './received-cursor.type';

interface ApStateStore {
  read(): ReceivedCursor | null;
  write(s: ReceivedCursor): void;
}

export type { ApStateStore };
