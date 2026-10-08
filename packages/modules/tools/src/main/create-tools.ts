/* @layer electron-main @kind logic */
import { join } from 'path';
import type { Result } from '@drizztdourden08/brock-core/result';
import type { ToolDef, ToolLocation, ToolState } from '../tools.type';
import type { ToolsEnv, ToolsMain } from './tools-main.type';
import { DEFAULT_VERSION } from './tools-main.constants';
import { defineTool } from './define-tool';
import { installTool } from './install-tool';
import { locateTool } from './locate-tool';
import { runBinary } from './run-binary';
import { toolState } from './tool-state';

const createTools = (env: ToolsEnv): ToolsMain => {
  const defs = new Map<string, ToolDef>();
  const pending = new Map<string, Promise<Result<ToolState>>>();
  const cacheDirOf = (def: ToolDef): string => join(env.cacheRoot, def.id, def.version ?? DEFAULT_VERSION);
  const need = (id: string): ToolDef => {
    const def = defs.get(id);
    if (!def) throw new Error(`no tool "${id}" is registered`);
    return def;
  };
  const locateDef = (def: ToolDef): Promise<ToolLocation | null> => locateTool(def, { cacheDir: cacheDirOf(def), platform: env.os, pathEnv: env.pathEnv });
  const canInstall = (def: ToolDef): boolean =>
    env.platform !== null && (def.downloads?.[env.platform] !== undefined || def.resolveDownload !== undefined);
  const stateOf = async (def: ToolDef): Promise<ToolState> => toolState(def, await locateDef(def), canInstall(def));

  const install = async (def: ToolDef): Promise<Result<ToolState>> => {
    try {
      await installTool(def, cacheDirOf(def), env);
      return { success: true, value: await stateOf(def) };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    } finally {
      pending.delete(def.id);
    }
  };

  return {
    register: (input) => {
      const def = defineTool(input);
      defs.set(def.id, def);
      return () => { defs.delete(def.id); };
    },
    list: () => Promise.all([...defs.values()].map(stateOf)),
    state: (id) => (defs.has(id) ? stateOf(need(id)) : Promise.resolve(null)),
    locate: (id) => locateDef(need(id)),
    install: (id) => {
      const running = pending.get(id) ?? install(need(id));
      pending.set(id, running);
      return running;
    },
    run: async (id, binary, args, options) => {
      const def = need(id);
      const file = (await locateDef(def))?.paths[binary];
      if (!def.binaries.includes(binary) || file === undefined) throw new Error(`${def.label} has no ${binary} installed`);
      return runBinary(file, args, options);
    },
  };
};

export { createTools };
