/* @layer electron-main @kind logic */
import type { McpToolInfo } from '../mcp.type';
import type { McpRuntime } from './mcp-main.type';
import { BUILT_IN_TOOLS } from '../built-in-tools.constants';
import { toolInfoOf } from '../tool-info-of';
import { assertOn } from './assert-on';

const withoutRepeats = (tools: McpToolInfo[]): McpToolInfo[] => {
  const seen = new Set<string>();
  return tools.filter((tool) => {
    if (seen.has(tool.name)) return false;
    seen.add(tool.name);
    return true;
  });
};

const listTools = async (runtime: McpRuntime): Promise<McpToolInfo[]> => {
  assertOn(runtime);
  const main = BUILT_IN_TOOLS.filter((spec) => spec.side === 'main').map(toolInfoOf);
  return withoutRepeats([...main, ...runtime.registry.list(), ...await runtime.renderer.list()]);
};

export { listTools };
