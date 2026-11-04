/* @layer electron-main @kind logic */
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { MCP_BRIDGE_LIMITS, MCP_RENDERER_CHANNEL } from '../mcp.constants';
import { createMcpRuntime } from './create-mcp-runtime';
import { mcpInstances } from './mcp-instances';
import { MCP_MODULE_ID } from './mcp-main.constants';
import { registerRoutes } from './register-routes';
import { registerStatusHandlers } from './status-handlers';

const createMcpMain = (): MainModule => ({
  id: MCP_MODULE_ID,
  register: (ctx) => {
    const runtime = createMcpRuntime(ctx);
    mcpInstances.set(ctx.bridge, runtime.mcp);
    if (!runtime.available) return;
    ctx.bridge.extend({
      id: MCP_MODULE_ID,
      openOnBoot: true,
      ...MCP_BRIDGE_LIMITS,
      register: (bridge) => registerRoutes(bridge, runtime),
    });
    registerStatusHandlers(runtime);
    ctx.on(MCP_RENDERER_CHANNEL.toolsChanged, () => runtime.changed());
  },
});

export { createMcpMain };
