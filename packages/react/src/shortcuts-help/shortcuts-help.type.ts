/* @layer renderer-shell @kind types */
interface ShortcutsHelpState {
  open: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

interface ShortcutRow {
  label: string;
  shortcut: string;
}

interface ShortcutGroup {
  title: string;
  rows: ShortcutRow[];
}

export type { ShortcutGroup, ShortcutRow, ShortcutsHelpState };
