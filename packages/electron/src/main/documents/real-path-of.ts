/* @layer electron-main @kind logic */
import { lstat, realpath } from 'fs/promises';
import { basename, dirname, join } from 'path';
import { SAME_PATH_RETRIES } from './real-path-of.constants';
import type { Lookup } from './real-path-of.type';

const isMissing = (error: unknown): boolean => {
  const code = (error as NodeJS.ErrnoException).code;
  return code === 'ENOENT' || code === 'ENOTDIR';
};

const whyMissing = async (path: string): Promise<Lookup> => {
  try {
    return (await lstat(path)).isSymbolicLink() ? { kind: 'refused' } : { kind: 'appeared' };
  } catch {
    return { kind: 'absent' };
  }
};

const lookup = async (path: string): Promise<Lookup> => {
  try {
    return { kind: 'real', real: await realpath(path) };
  } catch (error) {
    return isMissing(error) ? whyMissing(path) : { kind: 'refused' };
  }
};

const realPathOf = async (full: string): Promise<string | null> => {
  const tail: string[] = [];
  let current = full;
  let retries = 0;
  for (;;) {
    const found = await lookup(current);
    if (found.kind === 'real') return tail.length === 0 ? found.real : join(found.real, ...tail.reverse());
    if (found.kind === 'refused') return null;
    if (found.kind === 'appeared') {
      retries += 1;
      if (retries > SAME_PATH_RETRIES) return null;
    } else {
      retries = 0;
      const parent = dirname(current);
      if (parent === current) return null;
      tail.push(basename(current));
      current = parent;
    }
  }
};

export { realPathOf };
