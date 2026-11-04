/* @layer core @kind logic */
import type { McpToolDef, McpToolRegistry } from './mcp.type';
import { assertToolName } from './assert-tool-name';
import { toolInfoOf } from './tool-info-of';

const createToolRegistry = (reserved: readonly string[] = []): McpToolRegistry => {
  const tools = new Map<string, McpToolDef>();
  const listeners = new Set<() => void>();
  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };

  const register = (def: McpToolDef): (() => void) => {
    assertToolName(def.name);
    if (reserved.includes(def.name) || tools.has(def.name)) {
      throw new Error(`mcp tool "${def.name}" is already registered`);
    }
    tools.set(def.name, def);
    notify();
    return () => {
      if (tools.get(def.name) !== def) return;
      tools.delete(def.name);
      notify();
    };
  };

  const onChange = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    register,
    onChange,
    get: (name) => tools.get(name),
    list: () => [...tools.values()].map(toolInfoOf),
  };
};

export { createToolRegistry };
