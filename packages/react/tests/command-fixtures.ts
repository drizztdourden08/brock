/* @layer renderer-shell @kind test */
import type { CommandDef } from '../src/commands/command.type';
import { commands } from '../src/commands/commands';
import { useCommandStore } from '../src/commands/useCommandStore';

const registerFresh = (defs: CommandDef[], mac = false): (() => void) => {
  useCommandStore.setState({ sources: [], overrides: {}, mac, persist: null });
  return commands.register(defs);
};

export { registerFresh };
