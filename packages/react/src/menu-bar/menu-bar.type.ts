/* @layer renderer-shell @kind types */
import type { MenuNode } from '@drizztdourden08/tessera/composites';
import type { ChordLookup, CommandDef } from '../commands/command.type';

interface MenuBarSubmenu {
  label: string;
  entries: readonly MenuBarEntry[];
}

type MenuBarEntry = string | MenuBarSubmenu;

interface MenuBarMenu {
  id: string;
  label: string;
  entries: readonly MenuBarEntry[];
}

interface MenuBarView {
  defs: ReadonlyMap<string, CommandDef>;
  chords: ChordLookup;
}

interface BuiltMenu {
  id: string;
  label: string;
  nodes: readonly MenuNode[];
}

export type { BuiltMenu, MenuBarEntry, MenuBarMenu, MenuBarSubmenu, MenuBarView };
