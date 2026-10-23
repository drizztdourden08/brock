/* @layer renderer-shell @kind hook */
import { useCommandGroups } from '../../../commands/useCommandGroups';
import { shortcutGroups } from '../../shortcut-groups';
import type { ShortcutGroup } from '../../shortcuts-help.type';

const useShortcutGroups = (): ShortcutGroup[] => shortcutGroups(useCommandGroups());

export { useShortcutGroups };
