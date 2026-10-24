/* @layer electron-main @kind logic */
import { privateFileOps } from './private-file-ops';
import { writeAtomic } from './write-atomic';

const writePrivate = (full: string, data: string | Uint8Array): Promise<void> => writeAtomic(full, data, privateFileOps);

export { writePrivate };
