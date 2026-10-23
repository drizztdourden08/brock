/* @layer renderer-shell @kind logic */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { ChordLookup } from '../commands/command.type';
import { actionCommands } from './action-commands';

const withActionChord = (action: WindowTitleBarAction, lookup: ChordLookup): WindowTitleBarAction => {
  const id = actionCommands.of(action.id);
  const chords = id === undefined ? undefined : lookup(id);
  return chords === undefined ? action : { ...action, shortcut: chords[0] };
};

export { withActionChord };
