/* @layer renderer-shell @kind logic */
import { validateArgs } from '@drizztdourden08/brock-core/args';
import { commands } from '@drizztdourden08/brock-react';
import { defineMcpTool } from '../../define-mcp-tool';
import { MCP_ERROR } from '../../mcp.constants';
import type { McpReply } from '../../mcp.type';
import { toolFailure } from '../tool-failure';
import { argsReader } from './args-reader';
import { descriptorOf } from './descriptor-of';
import { parseCommandArgs } from './parse-command-args';

const runCommandTool = defineMcpTool({
  ...descriptorOf('run_command'),
  run: async (args): Promise<McpReply> => {
    const id = argsReader.text(args, 'id') ?? '';
    const def = commands.list({ includeHidden: true }).find((each) => each.id === id);
    if (def === undefined) return toolFailure(MCP_ERROR.invalidArguments, `Unknown command "${id}".`);
    const parsed = parseCommandArgs(argsReader.text(args, 'args'));
    if ('problem' in parsed) return toolFailure(MCP_ERROR.invalidArguments, parsed.problem);
    const problem = validateArgs(def.args ?? {}, parsed.value);
    if (problem !== null) return toolFailure(MCP_ERROR.invalidArguments, problem);
    const result = await commands.run(id, { point: { x: 0, y: 0 }, target: null, trigger: 'assistant', data: undefined, args: parsed.value });
    return result.ok ? { data: { ok: true } } : { data: { ok: false, why: result.why, reason: result.reason }, isError: true };
  },
});

export { runCommandTool };
