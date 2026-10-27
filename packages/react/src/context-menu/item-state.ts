/* @layer renderer-shell @kind logic */
import type { MenuItem } from '@drizztdourden08/tessera/composites';
import { commandBlock } from '../commands/command-block';
import type { CommandDef } from '../commands/command.type';
import type { ContextMenuItemState } from './context-menu.type';
import { defined } from './defined';
import { flagOf } from './flag-of';

const itemState = (entry: ContextMenuItemState, def?: CommandDef): Partial<MenuItem> => {
  const checked = flagOf(entry.checked ?? def?.checked);
  return {
    disabled: entry.disabled === true || (def !== undefined && commandBlock(def) !== null),
    ...defined('description', entry.reason),
    ...defined('ariaDescription', entry.reason),
    ...defined('tone', entry.tone),
    ...defined('kind', entry.kind ?? (checked === undefined ? undefined : 'check')),
    ...defined('checked', checked),
    ...defined('confirm', entry.confirm),
  };
};

export { itemState };
