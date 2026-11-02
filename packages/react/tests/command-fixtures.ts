/* @layer renderer-shell @kind test */
import type { CommandDef, HoldContext } from '../src/commands/command.type';
import { commands } from '../src/commands/commands';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { listenHolds } from '../src/commands/hold-listeners';
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

const presses: string[] = [];
const releases: HoldContext[] = [];
const stops: { listeners: () => void; commands: () => void } = { listeners: () => {}, commands: () => {} };

const startHolds = (defs: CommandDef[]): void => {
  presses.length = 0;
  releases.length = 0;
  stops.commands = registerFresh(defs);
  stops.listeners = listenHolds();
};

const stopHolds = (): void => {
  stops.listeners();
  stops.commands();
};

export { down, presses, registerFresh, releases, startHolds, stopHolds, stops, up };
