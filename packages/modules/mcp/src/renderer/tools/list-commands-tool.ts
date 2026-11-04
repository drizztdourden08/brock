/* @layer renderer-shell @kind logic */
import { commands } from '@drizztdourden08/brock-react';
import type { CommandDef } from '@drizztdourden08/brock-react';
import { defineMcpTool } from '../../define-mcp-tool';
import type { McpData } from '../../mcp.type';
import { argEntriesOf } from './arg-entries-of';
import { argsReader } from './args-reader';
import { descriptorOf } from './descriptor-of';

const matches = (def: CommandDef, query: string): boolean =>
  query === '' || [def.id, def.label, def.group ?? ''].some((text) => text.toLowerCase().includes(query));

const commandEntryOf = (def: CommandDef): McpData => {
  const state = commands.describe(def.id);
  return {
    id: def.id,
    label: def.label,
    group: def.group ?? null,
    enabled: state.enabled,
    reason: state.reason,
    args: argEntriesOf(def.args),
  };
};

const listCommandsTool = defineMcpTool({
  ...descriptorOf('list_commands'),
  run: (args) => {
    const query = (argsReader.text(args, 'query') ?? '').trim().toLowerCase();
    return { data: { commands: commands.list().filter((def) => matches(def, query)).map(commandEntryOf) } };
  },
});

export { listCommandsTool };
