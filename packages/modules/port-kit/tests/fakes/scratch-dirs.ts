/* @layer core @kind test */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const scratchDirs = (prefix: string): { make: () => string; clean: () => void } => {
  const dirs: string[] = [];
  return {
    make: () => {
      const dir = mkdtempSync(join(tmpdir(), prefix));
      dirs.push(dir);
      return dir;
    },
    clean: () => {
      for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
    },
  };
};

export { scratchDirs };
