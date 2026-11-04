/* @layer core @kind constants */
import { ask, defineChannels, invoke, send } from '@drizztdourden08/brock-core/ipc';
import type { McpArgs, McpStatus, McpToolInfo, McpToolResult } from './mcp.type';
import { MCP_RENDERER_CHANNEL } from './mcp.constants';

const MCP_CHANNELS = defineChannels({
  rendererList: ask<() => Promise<McpToolInfo[]>>()(MCP_RENDERER_CHANNEL.list),
  rendererCall: ask<(name: string, args: McpArgs | undefined) => Promise<McpToolResult>>()(MCP_RENDERER_CHANNEL.call),
  toolsChanged: send<() => void>()(MCP_RENDERER_CHANNEL.toolsChanged),
  status: invoke<() => Promise<McpStatus>>()('mcp:status'),
  setEnabled: invoke<(on: boolean) => Promise<McpStatus>>()('mcp:setEnabled'),
});

export { MCP_CHANNELS };
