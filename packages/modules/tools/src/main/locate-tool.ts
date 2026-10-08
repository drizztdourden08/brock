/* @layer electron-main @kind logic */
import { access, constants } from 'fs/promises';
import { delimiter, join } from 'path';
import type { ToolDef, ToolLocation } from '../tools.type';
import type { LocateInput } from './tools-main.type';
import { exeName } from './exe-name';

const runnable = (file: string, platform: NodeJS.Platform): Promise<boolean> =>
  access(file, platform === 'win32' ? constants.F_OK : constants.X_OK).then(() => true, () => false);

const allIn = async (dir: string, def: ToolDef, platform: NodeJS.Platform): Promise<Record<string, string> | null> => {
  const paths = Object.fromEntries(def.binaries.map((binary) => [binary, join(dir, exeName(binary, platform))]));
  const found = await Promise.all(Object.values(paths).map((file) => runnable(file, platform)));
  return found.every(Boolean) ? paths : null;
};

const onPath = async (def: ToolDef, { pathEnv, platform }: LocateInput): Promise<Record<string, string> | null> => {
  for (const dir of pathEnv.split(delimiter).filter(Boolean)) {
    const paths = await allIn(dir, def, platform);
    if (paths) return paths;
  }
  return null;
};

const locateTool = async (def: ToolDef, input: LocateInput): Promise<ToolLocation | null> => {
  const cached = await allIn(input.cacheDir, def, input.platform);
  if (cached) return { source: 'cache', paths: cached };
  if (def.usePath === false) return null;
  const found = await onPath(def, input);
  return found ? { source: 'path', paths: found } : null;
};

export { locateTool };
