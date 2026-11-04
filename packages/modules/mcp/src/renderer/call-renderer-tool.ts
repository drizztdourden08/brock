/* @layer renderer-shell @kind logic */
import { validateArgs } from '@drizztdourden08/brock-core/args';
import { MCP_ERROR, MCP_TIMEOUT_MS } from '../mcp.constants';
import type { McpArgs, McpToolResult } from '../mcp.type';
import { normalizeReply } from '../normalize-reply';
import { abortOf } from './abort-of';
import { failureOf } from './failure-of';
import { rendererRegistry } from './renderer-registry';
import { toolFailure } from './tool-failure';

const callRendererTool = async (name: string, args: McpArgs | undefined): Promise<McpToolResult> => {
  const def = rendererRegistry.get(name);
  if (def === undefined) return toolFailure(MCP_ERROR.unknownTool, `Unknown tool "${name}".`);
  const problem = validateArgs(def.args ?? {}, args);
  if (problem !== null) return toolFailure(MCP_ERROR.invalidArguments, problem);
  const signal = AbortSignal.timeout(MCP_TIMEOUT_MS.call);
  try {
    const reply = await Promise.race([Promise.resolve(def.run(args ?? {}, { name, signal })), abortOf(signal)]);
    return normalizeReply(reply);
  } catch (error) {
    return failureOf(error);
  }
};

export { callRendererTool };
