/* @layer electron-main @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import { MCP_ERROR } from '../mcp.constants';

const callFailure = (name: string, error: unknown): BridgeError => {
  if (error instanceof BridgeError) return error;
  const reason = error instanceof Error ? error.message : String(error);
  return new BridgeError(`${name} failed: ${reason}`, { code: MCP_ERROR.failed });
};

export { callFailure };
