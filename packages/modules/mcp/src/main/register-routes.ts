/* @layer electron-main @kind logic */
import type { BridgeServer } from '@drizztdourden08/brock-electron/main';
import type { McpRuntime } from './mcp-main.type';
import { callTool } from './call-tool';
import { helloOf } from './hello-of';
import { listTools } from './list-tools';
import { MCP_ROUTES } from './mcp-routes.constants';
import { routeChecks } from './route-checks';

const registerRoutes = (bridge: BridgeServer, runtime: McpRuntime): void => {
  bridge.handle(MCP_ROUTES.hello, () => helloOf(runtime), { validate: routeChecks.none });
  bridge.handle(MCP_ROUTES.tools, () => listTools(runtime), { validate: routeChecks.none });
  bridge.handle(MCP_ROUTES.call, (name, args) => callTool(runtime, name, args ?? {}), { validate: routeChecks.call });
};

export { registerRoutes };
