/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { SramStore } from './save-store.type';
import { SRAM_BACKUP_FILE, SRAM_FILE } from './save-slot.constants';
import { savesDirOf } from './saves-dir-of';

const createSramStore = (files: FileStore): SramStore => {
  const read = (profileId: string): Promise<Uint8Array | null> => files.readBytes(`${savesDirOf(profileId)}/${SRAM_FILE}`);

  const write = async (profileId: string, bytes: Uint8Array): Promise<void> => {
    const dir = savesDirOf(profileId);
    await files.mkdir(dir);
    const previous = await files.readBytes(`${dir}/${SRAM_FILE}`);
    if (previous) await files.writeBytes(`${dir}/${SRAM_BACKUP_FILE}`, previous);
    await files.writeBytes(`${dir}/${SRAM_FILE}`, bytes);
  };

  return { read, write };
};

export { createSramStore };
