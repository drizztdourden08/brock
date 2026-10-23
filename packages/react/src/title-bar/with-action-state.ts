/* @layer renderer-shell @kind logic */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { actionCommands } from './action-commands';
import { DISABLED } from './with-action-state.constants';

const noop = (): void => {};

const withActionState = (action: WindowTitleBarAction, enabled: (commandId: string) => boolean): WindowTitleBarAction => {
  if (!('onSelect' in action)) return action;
  const commandId = actionCommands.of(action.id);
  const explicit = 'disabled' in action && action.disabled === true;
  if (!explicit && (commandId === undefined || enabled(commandId))) return action;
  return { ...action, ...DISABLED, onSelect: noop };
};

export { withActionState };
