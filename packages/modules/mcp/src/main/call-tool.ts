/* @layer electron-main @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import { validateArgs } from '@drizztdourden08/brock-core/args';
import type { ArgSchema } from '@drizztdourden08/brock-core/args';
import type { McpArgs, McpBuiltInSpec, McpToolDef, McpToolResult } from '../mcp.type';
import type { McpRuntime } from './mcp-main.type';
import { BUILT_IN_TOOLS } from '../built-in-tools.constants';
import { MCP_ERROR, MCP_TIMEOUT_MS } from '../mcp.constants';
import { normalizeReply } from '../normalize-reply';
import { assertOn } from './assert-on';
import { callFailure } from './call-failure';
import { mainTools } from './tools/main-tools';
import { timedCall } from './timed-call';

const schemaOf = (spec: McpBuiltInSpec | undefined, def: McpToolDef | undefined): ArgSchema | null => {
  if (spec) return spec.args;
  return def ? (def.args ?? {}) : null;
};

const assertArgs = (schema: ArgSchema | null, args: McpArgs): void => {
  const problem = schema ? validateArgs(schema, args) : null;
  if (problem !== null) throw new BridgeError(problem, { code: MCP_ERROR.invalidArguments });
};

const callRenderer = async (runtime: McpRuntime, name: string, args: McpArgs): Promise<McpToolResult> => {
  const known = (await runtime.renderer.list()).some((tool) => tool.name === name);
  if (!known) throw new BridgeError(`There is no tool named "${name}".`, { code: MCP_ERROR.unknownTool });
  return runtime.renderer.call(name, args);
};

const dispatch = async (runtime: McpRuntime, name: string, args: McpArgs): Promise<McpToolResult> => {
  const spec = BUILT_IN_TOOLS.find((each) => each.name === name);
  const def = runtime.registry.get(name);
  assertArgs(schemaOf(spec, def), args);
  if (spec?.side === 'renderer') return runtime.renderer.call(name, args);
  const main = mainTools[name];
  if (main) return normalizeReply(await main(args, { ctx: runtime.ctx, queue: runtime.queue, win: runtime.ctx.window() }));
  if (def) return normalizeReply(await def.run(args, { name, signal: AbortSignal.timeout(MCP_TIMEOUT_MS.call) }));
  return callRenderer(runtime, name, args);
};

const callTool = async (runtime: McpRuntime, name: string, args: McpArgs = {}): Promise<McpToolResult> => {
  assertOn(runtime);
  return timedCall(runtime.ctx, name, async () => {
    try {
      return await dispatch(runtime, name, args);
    } catch (error) {
      throw callFailure(name, error);
    }
  });
};

export { callTool };
