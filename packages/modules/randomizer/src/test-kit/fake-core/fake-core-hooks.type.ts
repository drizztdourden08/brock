/* @layer core @kind types */
import type { ReceivedItem } from '../../archipelago';

interface FakeCoreHooks {
  isFromServer(item: ReceivedItem): boolean;
  deathOf(cause: unknown): { byRoom: boolean; text: string };
}

export type { FakeCoreHooks };
