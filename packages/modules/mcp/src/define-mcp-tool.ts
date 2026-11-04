/* @layer core @kind logic */
import type { McpToolDef } from './mcp.type';
import { assertToolName } from './assert-tool-name';

const defineMcpTool = (def: McpToolDef): McpToolDef => {
  assertToolName(def.name);
  return def;
};

export { defineMcpTool };
