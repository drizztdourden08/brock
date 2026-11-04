/* @layer electron-main @kind logic */
import type { McpRuntime } from './mcp-main.type';
import { MCP_CHANNELS } from '../mcp-channels.constants';

const registerStatusHandlers = ({ ctx, mcp }: McpRuntime): void => {
  ctx.handle(MCP_CHANNELS.status, () => Promise.resolve(mcp.status()));
  ctx.handle(MCP_CHANNELS.setEnabled, (_event, on) => {
    mcp.setEnabled(on === true);
    return Promise.resolve(mcp.status());
  });
};

export { registerStatusHandlers };
