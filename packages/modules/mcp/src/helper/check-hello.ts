/* @layer mcp-helper @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/bridge';
import type { BridgeClient } from '@drizztdourden08/brock-electron/bridge';
import { MCP_ERROR, MCP_PROTOCOL_VERSION } from '../mcp.constants';
import { HELPER_TEXT } from './helper.constants';
import { HELPER_ROUTE } from './helper-routes.constants';

const checkHello = async (client: BridgeClient): Promise<void> => {
  const hello = await client.request(HELPER_ROUTE.hello);
  if (hello.version !== MCP_PROTOCOL_VERSION) {
    throw new BridgeError(HELPER_TEXT.protocol(hello.version, MCP_PROTOCOL_VERSION), { code: MCP_ERROR.failed });
  }
};

export { checkHello };
