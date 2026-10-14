/* @layer electron-main @kind logic */
import { stat } from 'fs/promises';
import type { ToolProbeResult, ToolSpec } from './tools-main.type';
import { probeTool } from './probe-tool';

const fingerprintOf = async (paths: Record<string, string>): Promise<string> => {
  const stamps = await Promise.all(Object.values(paths).map(async (file) => {
    const info = await stat(file).catch(() => null);
    return info ? `${info.size}:${info.mtimeMs}` : 'gone';
  }));
  return stamps.join('|');
};

const createToolChecker = (): ((def: ToolSpec, paths: Record<string, string>) => Promise<ToolProbeResult>) => {
  const seen = new Map<string, { print: string; result: ToolProbeResult }>();
  return async (def, paths) => {
    const key = `${def.id}|${Object.values(paths).join('|')}`;
    const print = await fingerprintOf(paths);
    const known = seen.get(key);
    if (known?.print === print) return known.result;
    const result = await probeTool(def, paths);
    seen.set(key, { print, result });
    return result;
  };
};

export { createToolChecker };
