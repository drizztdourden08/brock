/* @layer renderer-shell @kind logic */
import type { CommandState } from './command.type';
import type { GateState } from './command-gates.type';

const commandEnabled = (state: Pick<CommandState, 'sources'> & Pick<GateState, 'gates'>, id: string): boolean => {
  const owner = [...state.sources].sort((a, b) => a.rank - b.rank).find((source) => source.defs.some((def) => def.id === id));
  return owner === undefined || state.gates[owner.key]?.[id] !== false;
};

export { commandEnabled };
