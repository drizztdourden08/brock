/* @layer renderer-shell @kind logic */
import { commands } from '../commands/commands';

const runToolbarCommand = (command: string, args: unknown): void => {
  void commands.run(command, { point: { x: 0, y: 0 }, target: null, trigger: 'pointer', data: undefined, args });
};

export { runToolbarCommand };
