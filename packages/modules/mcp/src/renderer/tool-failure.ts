/* @layer renderer-shell @kind logic */
import type { McpErrorCode, McpToolResult } from '../mcp.type';

const toolFailure = (code: McpErrorCode, message: string): McpToolResult => ({
  text: message,
  data: { code },
  images: [],
  isError: true,
});

export { toolFailure };
