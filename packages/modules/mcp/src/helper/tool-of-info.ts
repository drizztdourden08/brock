/* @layer mcp-helper @kind logic */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { McpToolInfo } from '../mcp.type';

const toolOfInfo = (info: McpToolInfo): Tool => ({
  name: info.name,
  title: info.title,
  description: info.description,
  inputSchema: info.inputSchema,
  annotations: { title: info.title, readOnlyHint: info.readOnly, destructiveHint: info.destructive, openWorldHint: false },
});

export { toolOfInfo };
