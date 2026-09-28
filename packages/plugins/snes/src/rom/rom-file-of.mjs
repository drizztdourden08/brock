/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { snesOptions } from '../snes-options.mjs';

/**
 * @param {{ userData: string, workspace?: object }} worktree
 * @returns {string | null} the ROM file name the isolated profile holds
 */
const romFileOf = (worktree) => {
  const roms = snesOptions('roms', worktree.workspace);
  const dir = join(worktree.userData, 'Data', 'roms');
  if (!existsSync(dir)) return null;
  const wanted = new Set(roms.extensions.map((ext) => ext.toLowerCase()));
  return readdirSync(dir).find((file) => wanted.has(extname(file).toLowerCase())) ?? null;
};

export { romFileOf };
