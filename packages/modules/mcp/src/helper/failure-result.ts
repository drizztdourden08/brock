/* @layer mcp-helper @kind logic */
import type { McpErrorCode, McpToolResult } from '../mcp.type';

const failureResult = (code: McpErrorCode, message: string, hint?: string): McpToolResult => ({
  text: hint === undefined ? `${code}: ${message}` : `${code}: ${message} ${hint}`,
  data: hint === undefined ? { code, message } : { code, message, hint },
  images: [],
  isError: true,
});

export { failureResult };
