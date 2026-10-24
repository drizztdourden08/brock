/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { readOrNull } from '../storage/read-or-null';
import { writeAtomic } from '../storage/write-atomic';
import { KEY_BYTES } from './signing-key.constants';

const createSigningKey = (fileOf: () => string): (() => Promise<Buffer>) => {
  let pending: Promise<Buffer> | null = null;
  const load = async (): Promise<Buffer> => {
    const stored = await readOrNull(fileOf());
    if (stored !== null && stored.length === KEY_BYTES) return stored;
    const fresh = randomBytes(KEY_BYTES);
    await writeAtomic(fileOf(), fresh);
    return fresh;
  };
  return () => {
    pending ??= load();
    return pending;
  };
};

export { createSigningKey };
