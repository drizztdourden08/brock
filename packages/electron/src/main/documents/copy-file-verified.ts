/* @layer electron-main @kind logic */
import { createHash } from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { lstat, open, rm } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { fileDigest } from './file-digest';

const copyFileVerified = async (from: string, to: string): Promise<void> => {
  const before = await lstat(from);
  const hash = createHash('sha256');
  const reader = createReadStream(from);
  reader.on('data', (chunk) => hash.update(chunk as Buffer));
  try {
    await pipeline(reader, createWriteStream(to, { flags: 'wx' }));
    const handle = await open(to, 'r+');
    await handle.sync().finally(() => handle.close());
    const after = await lstat(from);
    if (after.size !== before.size || after.mtimeMs !== before.mtimeMs) throw new Error(`"${from}" changed while it was being copied`);
    if ((await fileDigest(to)) !== hash.digest('hex')) throw new Error(`The copy of "${from}" did not match the original`);
  } catch (error) {
    await rm(to, { force: true });
    throw error;
  }
};

export { copyFileVerified };
