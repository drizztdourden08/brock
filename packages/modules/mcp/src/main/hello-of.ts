/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { McpHello, McpRuntime } from './mcp-main.type';
import { MCP_PROTOCOL_VERSION } from '../mcp.constants';

const helloOf = ({ ctx, isOn }: McpRuntime): McpHello => ({
  version: MCP_PROTOCOL_VERSION,
  app: ctx.product.id,
  name: ctx.product.name,
  appVersion: app.getVersion(),
  enabled: isOn(),
});

export { helloOf };
