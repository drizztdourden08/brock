/* @layer renderer-shell @kind types */
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import type { MenuItem } from '@drizztdourden08/tessera/composites';
import type { CommandContext, CommandDef, CommandState, CommandTrigger } from '../commands/command.type';

type ContextMenuEvent = ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>;

interface ContextMenuPoint {
  x: number;
  y: number;
}

type ContextMenuContext = Omit<CommandContext, 'args'>;

type ContextMenuFlag = boolean | (() => boolean);

interface ContextMenuItemState {
  hidden?: ContextMenuFlag;
  disabled?: boolean;
  reason?: string;
  checked?: ContextMenuFlag;
  kind?: 'check' | 'radio' | 'confirm';
  confirm?: string;
}

interface ContextMenuCommand extends ContextMenuItemState {
  command: string;
  label?: string;
  args?: unknown;
}

interface ContextMenuAction extends ContextMenuItemState {
  label: string;
  icon?: MenuItem['icon'];
  run: (context: ContextMenuContext) => void;
}

interface ContextMenuSubmenu {
  label: string;
  items: readonly ContextMenuEntry[];
  icon?: MenuItem['icon'];
  hidden?: ContextMenuFlag;
  disabled?: boolean;
}

type ContextMenuEntry = string | ContextMenuCommand | ContextMenuAction | ContextMenuSubmenu;

type ContextMenuEntries = readonly ContextMenuEntry[] | ((context: ContextMenuContext) => readonly ContextMenuEntry[]);

interface ContextMenuAnchor extends ContextMenuPoint {
  data?: unknown;
}

interface ContextMenuConfig {
  entries: ContextMenuEntries;
  label?: string | ((context: ContextMenuContext) => string);
  anchor?: (where: { target: Element; data: unknown }) => ContextMenuAnchor | null;
  shouldOpen?: (event: MouseEvent, data: unknown) => boolean;
  openOn?: 'press' | 'release-without-drag';
  beforeOpen?: (context: ContextMenuContext) => boolean | void;
  inherit?: 'parent';
}

type ContextMenuSource = ContextMenuEntries | ContextMenuConfig;

interface ContextMenuZoneOptions {
  data?: unknown;
  typing?: boolean;
  focusable?: boolean;
}

interface ContextMenuAttributes {
  'data-context-menu': string;
  'aria-haspopup': 'menu';
  'data-context-menu-data'?: string;
  'data-context-menu-typing'?: '';
  tabIndex?: 0;
}

interface ContextMenuOpen {
  entries: readonly ContextMenuEntry[];
  point: ContextMenuPoint;
  context: ContextMenuContext;
  label: string;
}

interface ContextMenuState {
  menus: Readonly<Record<string, ContextMenuConfig>>;
  open: ContextMenuOpen | null;
  blocked: boolean;
  setMenu: (zone: string, config: ContextMenuConfig) => void;
  clearMenu: (zone: string) => void;
  show: (open: ContextMenuOpen) => void;
  hide: () => void;
  block: (blocked: boolean) => void;
}

interface ContextMenuView {
  defs: ReadonlyMap<string, CommandDef>;
  state: Pick<CommandState, 'overrides' | 'mac'>;
  context: ContextMenuContext;
}

interface ZoneMatch {
  zone: string;
  element: Element;
  config: ContextMenuConfig;
  data: unknown;
}

interface OpenRequest {
  target: Element;
  point: ContextMenuPoint | null;
  trigger: CommandTrigger;
  data?: unknown;
}

type OpenResult = 'opened' | 'cancelled' | 'none';

interface OpenOptions {
  point?: ContextMenuPoint;
  trigger?: CommandTrigger;
}

interface ListedContextMenu {
  zone: string;
  entries: readonly ContextMenuEntry[];
  commands: readonly string[];
  missing: readonly string[];
}

interface OpenContextMenuProps {
  open: ContextMenuOpen | null;
}

interface PointerDown {
  x: number;
  y: number;
  allowed: boolean;
  release: boolean;
}

interface LongPress {
  pointerId: number;
  x: number;
  y: number;
  target: Element;
  timer: number;
  fired: boolean;
}

interface PointerGesture {
  down: PointerDown | null;
  press: LongPress | null;
  kind: string;
}

export type {
  ContextMenuAction, ContextMenuAnchor, ContextMenuAttributes, ContextMenuCommand, ContextMenuConfig, ContextMenuContext, ContextMenuEntries, ContextMenuEvent, ContextMenuEntry, ContextMenuFlag, ContextMenuItemState,
  ContextMenuPoint, ContextMenuSource, ContextMenuState, ContextMenuSubmenu, ContextMenuView, ContextMenuZoneOptions, ListedContextMenu, OpenContextMenuProps, OpenOptions,
  OpenRequest, OpenResult, PointerDown, PointerGesture, ZoneMatch,
};
