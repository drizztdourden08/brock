/* @layer renderer-shell @kind logic */
import type { CommandDef, CommandState } from './command.type';

const listCommands = (state: Pick<CommandState, 'sources'>): CommandDef[] => {
  const seen = new Set<string>();
  const ranked = [...state.sources].sort((a, b) => a.rank - b.rank);
  return ranked.flatMap((source) => source.defs).filter((def) => {
    if (seen.has(def.id)) return false;
    seen.add(def.id);
    return true;
  });
};

export { listCommands };
