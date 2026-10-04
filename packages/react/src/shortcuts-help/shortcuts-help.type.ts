/* @layer renderer-shell @kind types */
import type { RouteShortcut } from '../navigation/navigation.type';
import type { ScreenDef } from '../screens/screen.type';

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

interface ShortcutSources {
  screens: readonly ScreenDef[];
  routes: readonly RouteShortcut[];
  labelOf: (target: string) => string;
  fullscreen: boolean;
}

export type { ShortcutGroup, ShortcutRow, ShortcutSources, ShortcutsHelpState };
