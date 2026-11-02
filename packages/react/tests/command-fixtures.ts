/* @layer renderer-shell @kind test */
import type { CommandDef } from '../src/commands/command.type';
import { commands } from '../src/commands/commands';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { useCommandStore } from '../src/commands/useCommandStore';

const registerFresh = (defs: CommandDef[], mac = false): (() => void) => {
  useCommandStore.setState({ sources: [], overrides: {}, mac, persist: null });
  return commands.register(defs);
};

const down = (init: KeyboardEventInit): void => {
  document.documentElement.addEventListener('keydown', (each) => dispatchCommand(each, null), { once: true });
  document.documentElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
};

const up = (init: KeyboardEventInit): void => {
  document.documentElement.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, ...init }));
};

export { down, registerFresh, up };
