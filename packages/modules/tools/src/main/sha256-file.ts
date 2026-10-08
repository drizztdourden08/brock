/* @layer electron-main @kind logic */
import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

const sha256File = async (file: string): Promise<string> => {
  const hash = createHash('sha256');
  await pipeline(createReadStream(file), hash);
  return hash.digest('hex');
};

export { sha256File };
