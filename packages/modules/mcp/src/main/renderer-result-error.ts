/* @layer electron-main @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import type { McpToolResult } from '../mcp.type';
import { MCP_ERROR } from '../mcp.constants';

const CODED: readonly string[] = [MCP_ERROR.unknownTool, MCP_ERROR.invalidArguments, MCP_ERROR.timeout, MCP_ERROR.failed];

const rendererResultError = (result: McpToolResult): BridgeError | null => {
  const code = result.data?.code;
  if (!result.isError || typeof code !== 'string' || !CODED.includes(code)) return null;
  return new BridgeError(result.text, { code });
};

export { rendererResultError };
