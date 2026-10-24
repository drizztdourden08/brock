/* @layer electron-main @kind logic */
import { realpathSync } from 'fs';
import { basename, dirname, join, resolve } from 'path';

const realPathSyncOf = (path: string): { real: string; exists: boolean } => {
  const tail: string[] = [];
  let current = resolve(path);
  for (;;) {
    try {
      const real = realpathSync.native(current);
      return { real: tail.length === 0 ? real : join(real, ...tail.reverse()), exists: tail.length === 0 };
    } catch {
      const parent = dirname(current);
      if (parent === current) return { real: resolve(path), exists: false };
      tail.push(basename(current));
      current = parent;
    }
  }
};

export { realPathSyncOf };
