/* @layer electron-main @kind constants */
import { defineChannels, event, invoke } from '@drizztdourden08/brock-core/ipc';
import type { McpArgs, McpToolInfo, McpToolResult } from '../mcp.type';
import type { McpHello } from './mcp-main.type';
import { MCP_ROUTE } from '../mcp.constants';

const MCP_ROUTES = defineChannels({
  hello: invoke<() => Promise<McpHello>>()(MCP_ROUTE.hello),
  tools: invoke<() => Promise<McpToolInfo[]>>()(MCP_ROUTE.tools),
  call: invoke<(name: string, args?: McpArgs) => Promise<McpToolResult>>()(MCP_ROUTE.call),
  toolsChanged: event<() => void>()(MCP_ROUTE.toolsChanged),
});

export { MCP_ROUTES };
