/* @layer mcp-helper @kind constants */
import { MCP_ERROR } from '../mcp.constants';
import type { McpErrorCode } from '../mcp.type';

const FORWARDED_CODES: readonly McpErrorCode[] = [MCP_ERROR.off, MCP_ERROR.unknownTool, MCP_ERROR.invalidArguments, MCP_ERROR.noWindow];

export { FORWARDED_CODES };
