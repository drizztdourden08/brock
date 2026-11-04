/* @layer mcp-helper @kind logic */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BUILT_IN_TOOLS } from '../built-in-tools.constants';
import type { McpToolInfo } from '../mcp.type';
import { toolInfoOf } from '../tool-info-of';
import { SELECT_APP_SPEC } from './helper.constants';
import type { AppLink } from './helper.type';
import { helperLog } from './helper-log';
import { toolOfInfo } from './tool-of-info';

const selectAppInfo = toolInfoOf(SELECT_APP_SPEC);

const offlineTools = (): McpToolInfo[] => [...BUILT_IN_TOOLS.map((spec) => toolInfoOf(spec)), selectAppInfo];

const liveTools = (tools: readonly McpToolInfo[]): McpToolInfo[] => [...tools.filter((tool) => tool.name !== selectAppInfo.name), selectAppInfo];

const listTools = async (link: AppLink): Promise<Tool[]> => {
  try {
    return liveTools(await link.tools()).map(toolOfInfo);
  } catch (error) {
    helperLog(`app tools unavailable, listing the built-ins: ${error instanceof Error ? error.message : String(error)}`);
    return offlineTools().map(toolOfInfo);
  }
};

export { listTools };
