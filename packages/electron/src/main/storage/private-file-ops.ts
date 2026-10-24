/* @layer electron-main @kind logic */
import type { AtomicFileOps } from './write-atomic.type';
import { atomicFileOps } from './atomic-file-ops';
import { PRIVATE_FILE_MODE } from './storage.constants';
import { syncedWriter } from './synced-writer';

const privateFileOps: AtomicFileOps = { ...atomicFileOps, writeSynced: syncedWriter(PRIVATE_FILE_MODE) };

export { privateFileOps };
