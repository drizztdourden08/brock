/* @layer mcp-helper @kind logic */
import { BRIDGE_CODES, BridgeError } from '@drizztdourden08/brock-electron/bridge';
import { MCP_ERROR } from '../mcp.constants';
import type { McpErrorCode, McpToolResult } from '../mcp.type';
import { failureResult } from './failure-result';
import { HELPER_TEXT } from './helper.constants';

const FORWARDED: readonly McpErrorCode[] = [MCP_ERROR.off, MCP_ERROR.unknownTool, MCP_ERROR.invalidArguments, MCP_ERROR.noWindow];

const remoteCodeOf = (error: BridgeError): McpErrorCode => {
  if (error.code === BRIDGE_CODES.timeout) return MCP_ERROR.timeout;
  return FORWARDED.find((code) => code === error.code) ?? MCP_ERROR.failed;
};

const bridgeFailure = (error: unknown, file: string): McpToolResult => {
  if (error instanceof BridgeError && error.code !== BRIDGE_CODES.closed) return failureResult(remoteCodeOf(error), error.message);
  return failureResult(MCP_ERROR.appDown, HELPER_TEXT.appDown(file), HELPER_TEXT.startHint);
};

export { bridgeFailure };
