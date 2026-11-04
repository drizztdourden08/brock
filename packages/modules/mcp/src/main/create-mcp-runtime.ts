/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { McpMain, McpRuntime } from './mcp-main.type';
import { BUILT_IN_TOOLS } from '../built-in-tools.constants';
import { createSerialQueue } from '../serial-queue';
import { createToolRegistry } from '../create-tool-registry';
import { mcpEnabled } from '../mcp-enabled';
import { MCP_HELPER_TOOL_NAMES } from './mcp-main.constants';
import { MCP_ROUTES } from './mcp-routes.constants';
import { createRendererTools } from './renderer-tools';

const RESERVED = [...BUILT_IN_TOOLS.map((spec) => spec.name), ...MCP_HELPER_TOOL_NAMES];

const createMcpRuntime = (ctx: MainContext): McpRuntime => {
  const available = mcpEnabled({
    isPackaged: app.isPackaged,
    options: ctx.product.moduleOptions?.mcp,
    argv: process.argv,
    env: process.env,
  });
  const registry = createToolRegistry(RESERVED);
  let on = available;
  const isOn = (): boolean => available && on;
  const changed = (): void => {
    ctx.bridge.current()?.emit(MCP_ROUTES.toolsChanged);
  };
  const mcp: McpMain = {
    tools: registry,
    setEnabled: (next) => {
      if (on === next) return;
      on = next;
      changed();
    },
    status: () => ({ enabled: isOn(), packaged: app.isPackaged, tools: BUILT_IN_TOOLS.length + registry.list().length }),
  };
  registry.onChange(changed);
  return { ctx, available, registry, queue: createSerialQueue(), renderer: createRendererTools(ctx), mcp, isOn, changed };
};

export { createMcpRuntime };
