/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface ShortcutsHelpState {
  open: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

interface ShortcutRow {
  label: Text;
  shortcut: string;
}

interface ShortcutGroup {
  title: string;
  rows: ShortcutRow[];
}

export type { ShortcutGroup, ShortcutRow, ShortcutsHelpState };
