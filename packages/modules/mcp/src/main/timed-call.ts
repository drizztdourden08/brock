/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { McpToolResult } from '../mcp.type';
import { MCP_TOOL_NAME_REGEX } from '../mcp.constants';
import { MCP_LOG_UNKNOWN_NAME } from './mcp-main.constants';

const timedCall = async (ctx: MainContext, name: string, job: () => Promise<McpToolResult>): Promise<McpToolResult> => {
  const shown = MCP_TOOL_NAME_REGEX.test(name) ? name : MCP_LOG_UNKNOWN_NAME;
  const started = Date.now();
  const note = (outcome: 'ok' | 'failed'): void => ctx.log(`mcp: ${shown} ${outcome} in ${Date.now() - started} ms`);
  try {
    const result = await job();
    note(result.isError ? 'failed' : 'ok');
    return result;
  } catch (error) {
    note('failed');
    throw error;
  }
};

export { timedCall };
