/* @layer electron-main @kind logic */
import { createHash } from 'crypto';
import { createReadStream } from 'fs';

const fileDigest = async (path: string): Promise<string> => {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk as Buffer);
  return hash.digest('hex');
};

export { fileDigest };
