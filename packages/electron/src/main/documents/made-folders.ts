/* @layer electron-main @kind logic */
import { mkdtempSync, realpathSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { TEMP_PREFIX_DEFAULT, TEMP_PREFIX_PATTERN } from './made-folders.constants';
import type { MadeFolders } from './made-folders.type';
import { pathInside } from './path-inside';
import { pathKey } from './path-key';

const createMadeFolders = (root: () => string = tmpdir): MadeFolders => {
  const made = new Set<string>();

  const make = (prefix = TEMP_PREFIX_DEFAULT): string => {
    if (!TEMP_PREFIX_PATTERN.test(prefix) || prefix.includes('..')) throw new Error(`"${prefix}" is not a plain name prefix`);
    const real = realpathSync.native(mkdtempSync(join(root(), prefix)));
    made.add(real);
    return real;
  };

  const holds = (real: string): boolean => [...made].some((folder) => pathInside(folder, real, pathKey));

  return { make, holds, clear: () => made.clear() };
};

export { createMadeFolders };
