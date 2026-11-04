/* @layer renderer-shell @kind logic */
import type { McpToolDef } from '../mcp.type';
import { mcpTools } from './mcp-tools';

const registerAll = (defs: readonly McpToolDef[]): (() => void) => {
  const offs: (() => void)[] = [];
  const release = (): void => {
    for (const off of offs.splice(0)) off();
  };
  try {
    for (const def of defs) offs.push(mcpTools.register(def));
  } catch (error) {
    release();
    throw error;
  }
  return release;
};

export { registerAll };
