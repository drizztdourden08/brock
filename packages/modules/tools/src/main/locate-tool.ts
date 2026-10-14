/* @layer electron-main @kind logic */
import { access, constants } from 'fs/promises';
import { delimiter, join } from 'path';
import type { ToolDef, ToolLocation, ToolSource } from '../tools.type';
import type { LocateInput } from './tools-main.type';
import { exeName } from './exe-name';

const runnable = (file: string, platform: NodeJS.Platform): Promise<boolean> =>
  access(file, platform === 'win32' ? constants.F_OK : constants.X_OK).then(() => true, () => false);

const allIn = async (dir: string, def: ToolDef, platform: NodeJS.Platform): Promise<Record<string, string> | null> => {
  const paths = Object.fromEntries(def.binaries.map((binary) => [binary, join(dir, exeName(binary, platform))]));
  const found = await Promise.all(Object.values(paths).map((file) => runnable(file, platform)));
  return found.every(Boolean) ? paths : null;
};

const candidates = (def: ToolDef, { cacheDir, pathEnv }: LocateInput): { source: ToolSource; dir: string }[] => [
  { source: 'cache', dir: cacheDir },
  ...(def.usePath === false ? [] : pathEnv.split(delimiter).filter(Boolean).map((dir) => ({ source: 'path' as const, dir }))),
];

const locateTool = async (def: ToolDef, input: LocateInput): Promise<ToolLocation | null> => {
  for (const { source, dir } of candidates(def, input)) {
    const paths = await allIn(dir, def, input.platform);
    if (!paths) continue;
    if (!input.check) return { source, paths };
    const verdict = await input.check(paths);
    if (verdict.ok) return { source, paths, version: verdict.version ?? null };
  }
  return null;
};

export { locateTool };
