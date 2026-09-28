/* @layer electron-main @kind logic */
import { app } from 'electron';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { ARG_PREFIX } from './user-data-arg.constants';

const applyUserDataArg = (argv: readonly string[] = process.argv): string | null => {
  const arg = argv.find((a) => a.startsWith(ARG_PREFIX));
  if (!arg) return null;

  const dir = resolve(arg.slice(ARG_PREFIX.length));
  mkdirSync(dir, { recursive: true });
  app.setPath('userData', dir);
  return dir;
};

export { applyUserDataArg };
