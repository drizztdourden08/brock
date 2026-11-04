/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { McpMain } from './mcp-main.type';
import { mcpInstances } from './mcp-instances';

const getMcp = (ctx: Pick<MainContext, 'bridge'>): McpMain => {
  const found = mcpInstances.get(ctx.bridge);
  if (!found) throw new Error('mcp: the module is not registered, add "mcp" to the modules of the app');
  return found;
};

export { getMcp };
