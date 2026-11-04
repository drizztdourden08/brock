/* @layer electron-main @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import type { McpRuntime } from './mcp-main.type';
import { MCP_ERROR } from '../mcp.constants';
import { MCP_MESSAGE } from './mcp-main.constants';

const assertOn = (runtime: Pick<McpRuntime, 'isOn'>): void => {
  if (!runtime.isOn()) throw new BridgeError(MCP_MESSAGE.off, { code: MCP_ERROR.off });
};

export { assertOn };
