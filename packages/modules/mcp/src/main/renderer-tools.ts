/* @layer electron-main @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { McpToolInfo, McpToolResult } from '../mcp.type';
import type { RendererTools } from './mcp-main.type';
import { BUILT_IN_TOOLS } from '../built-in-tools.constants';
import { MCP_ERROR, MCP_RENDERER_CHANNEL, MCP_TIMEOUT_MS } from '../mcp.constants';
import { toolInfoOf } from '../tool-info-of';
import { MCP_MESSAGE } from './mcp-main.constants';
import { rendererFailure } from './renderer-failure';
import { rendererResultError } from './renderer-result-error';

const builtInRendererTools = (): McpToolInfo[] => BUILT_IN_TOOLS.filter((spec) => spec.side === 'renderer').map(toolInfoOf);

const createRendererTools = (ctx: MainContext): RendererTools => {
  const list = async (): Promise<McpToolInfo[]> => {
    const win = ctx.window();
    if (!win) return builtInRendererTools();
    try {
      return await ctx.askWithin(MCP_TIMEOUT_MS.rendererAsk, win, MCP_RENDERER_CHANNEL.list);
    } catch {
      return builtInRendererTools();
    }
  };

  const ask = async (name: string, args: Parameters<RendererTools['call']>[1]): Promise<McpToolResult> => {
    const win = ctx.window();
    if (!win) throw new BridgeError(MCP_MESSAGE.noWindow, { code: MCP_ERROR.noWindow });
    try {
      return await ctx.askWithin(MCP_TIMEOUT_MS.rendererAsk, win, MCP_RENDERER_CHANNEL.call, name, args);
    } catch (error) {
      throw rendererFailure(error);
    }
  };

  const call: RendererTools['call'] = async (name, args) => {
    const result = await ask(name, args);
    const failure = rendererResultError(result);
    if (failure) throw failure;
    return result;
  };

  return { list, call };
};

export { createRendererTools };
