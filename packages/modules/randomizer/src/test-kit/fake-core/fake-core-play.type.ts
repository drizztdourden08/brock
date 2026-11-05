/* @layer core @kind types */
import type { FakeCore } from './fake-core.type';

type FakeCorePlay = Pick<FakeCore,
  | 'isFileInPlay' | 'onSaveSwap' | 'setInPlay' | 'swapSave' | 'readReceivedIndex' | 'writeReceivedIndex'
  | 'readRoomHash' | 'writeRoomHash'>;

export type { FakeCorePlay };
