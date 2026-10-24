/* @layer electron-main @kind logic */
import { app } from 'electron';
import { readFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';

const samePath = (a: string, b: string): boolean => relative(a, b) === '';

const mainOf = (folder: string): string | null => {
  try {
    const { main } = JSON.parse(readFileSync(join(folder, 'package.json'), 'utf8')) as { main?: unknown };
    return typeof main === 'string' ? resolve(folder, main) : null;
  } catch {
    return null;
  }
};

const appFolder = (): string => {
  const start = resolve(app.getAppPath());
  const entry = process.argv[1] === undefined ? null : resolve(process.argv[1]);
  for (let folder = start; ; folder = dirname(folder)) {
    const main = mainOf(folder);
    if (main !== null && entry !== null && (samePath(main, entry) || samePath(folder, entry))) return folder;
    if (dirname(folder) === folder) return app.getAppPath();
  }
};

export { appFolder };
