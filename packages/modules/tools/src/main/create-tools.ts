/* @layer electron-main @kind logic */
import { join } from 'path';
import type { Result } from '@drizztdourden08/brock-core/result';
import type { ToolLocation, ToolState } from '../tools.type';
import type { ToolSpec, ToolsEnv, ToolsMain } from './tools-main.type';
import { DEFAULT_VERSION } from './tools-main.constants';
import { createToolChecker } from './create-tool-checker';
import { defineTool } from './define-tool';
import { installTool } from './install-tool';
import { locateTool } from './locate-tool';
import { runToolCall } from './run-tool-call';
import { toolState } from './tool-state';

const readPathEnv = ({ pathEnv }: ToolsEnv): Promise<string> => Promise.resolve(typeof pathEnv === 'string' ? pathEnv : pathEnv());

const createTools = (env: ToolsEnv): ToolsMain => {
  const defs = new Map<string, ToolSpec>();
  const pending = new Map<string, Promise<Result<ToolState>>>();
  const check = createToolChecker();
  const cacheDirOf = (def: ToolSpec): string => join(env.cacheRoot, def.id, def.version ?? DEFAULT_VERSION);
  const need = (id: string): ToolSpec => {
    const def = defs.get(id);
    if (!def) throw new Error(`no tool "${id}" is registered`);
    return def;
  };
  const locateDef = async (def: ToolSpec): Promise<ToolLocation | null> => locateTool(def, {
    cacheDir: cacheDirOf(def), platform: env.os, pathEnv: await readPathEnv(env), check: def.probe ? (paths) => check(def, paths) : undefined,
  });
  const canInstall = (def: ToolSpec): boolean =>
    env.platform !== null && (def.downloads?.[env.platform] !== undefined || def.resolveDownload !== undefined);
  const stateOf = async (def: ToolSpec): Promise<ToolState> => toolState(def, await locateDef(def), canInstall(def));

  const install = async (def: ToolSpec): Promise<Result<ToolState>> => {
    try {
      await installTool(def, cacheDirOf(def), env);
      const value = await stateOf(def);
      env.onChanged?.(def.id);
      return { success: true, value };
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
    run: async (id, binary, args, options = {}) => {
      const def = need(id);
      const file = (await locateDef(def))?.paths[binary];
      if (!def.binaries.includes(binary) || file === undefined) throw new Error(`${def.label} has no ${binary} installed`);
      return runToolCall(def, { binary, file, args, options });
    },
  };
};

export { createTools };
