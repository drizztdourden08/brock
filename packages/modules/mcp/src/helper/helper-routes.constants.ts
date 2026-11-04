/* @layer mcp-helper @kind constants */
import { event, invoke } from '@drizztdourden08/brock-core/ipc';
import { MCP_ROUTE } from '../mcp.constants';
import type { McpToolInfo, McpToolResult } from '../mcp.type';
import type { McpHello, McpJsonArgs } from './helper.type';

const HELPER_ROUTE = {
  hello: invoke<() => Promise<McpHello>>()(MCP_ROUTE.hello),
  tools: invoke<() => Promise<McpToolInfo[]>>()(MCP_ROUTE.tools),
  call: invoke<(name: string, args: McpJsonArgs) => Promise<McpToolResult>>()(MCP_ROUTE.call),
  toolsChanged: event<() => void>()(MCP_ROUTE.toolsChanged),
} as const;

export { HELPER_ROUTE };
