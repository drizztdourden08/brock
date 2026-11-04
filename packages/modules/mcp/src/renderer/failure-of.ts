/* @layer renderer-shell @kind logic */
import { MCP_ERROR } from '../mcp.constants';
import type { McpToolResult } from '../mcp.type';
import { toolFailure } from './tool-failure';

const failureOf = (error: unknown): McpToolResult => {
  if (error instanceof DOMException && error.name === 'TimeoutError') return toolFailure(MCP_ERROR.timeout, 'The tool timed out.');
  return toolFailure(MCP_ERROR.failed, error instanceof Error ? error.message : String(error));
};

export { failureOf };
