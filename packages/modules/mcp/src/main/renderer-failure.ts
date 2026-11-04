/* @layer electron-main @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import { MCP_ERROR } from '../mcp.constants';
import { MCP_ASK_TIMED_OUT, MCP_ASK_WINDOW_GONE, MCP_MESSAGE } from './mcp-main.constants';

const rendererFailure = (error: unknown): BridgeError => {
  const message = error instanceof Error ? error.message : String(error);
  if (MCP_ASK_TIMED_OUT.test(message)) return new BridgeError(MCP_MESSAGE.timeout, { code: MCP_ERROR.timeout });
  if (MCP_ASK_WINDOW_GONE.test(message)) return new BridgeError(MCP_MESSAGE.noWindow, { code: MCP_ERROR.noWindow });
  return new BridgeError(message, { code: MCP_ERROR.failed });
};

export { rendererFailure };
