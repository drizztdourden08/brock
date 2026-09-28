/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { SaveStore } from './save-store.type';
import { createNamedSaveStore } from './create-named-save-store';
import { createSlotStore } from './create-slot-store';
import { createSramStore } from './create-sram-store';

const createSaveStore = (files: FileStore): SaveStore => {
  const slots = createSlotStore(files);
  return { sram: createSramStore(files), slots, named: createNamedSaveStore(files, slots) };
};

export { createSaveStore };
