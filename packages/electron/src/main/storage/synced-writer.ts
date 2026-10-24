/* @layer electron-main @kind logic */
import { open } from 'fs/promises';
import type { AtomicFileOps, OpenFile } from './write-atomic.type';

const syncedWriter = (mode?: number, openFile: OpenFile = open): AtomicFileOps['writeSynced'] => async (file, data) => {
  const handle = await openFile(file, 'w', mode);
  try {
    await handle.writeFile(data);
    await handle.sync();
  } finally {
    await handle.close();
  }
};

export { syncedWriter };
