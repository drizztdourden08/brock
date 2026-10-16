/* @layer renderer-shell @kind types */
import type { ProductMenu, ProductMenuEntry, ProductMenuGroup } from '@drizztdourden08/brock-core';
import type { MenuEntry, MenuItem } from './menu.type';

type MenuGroupId = ProductMenuGroup;

type MenuEntryOverride = ProductMenuEntry;

type MenuConfig = ProductMenu;

type MenuGroups = Readonly<Record<MenuGroupId, readonly MenuEntry[]>>;

type TuckedRow = 'pin' | 'fullscreen';

interface BarMarker {
  key: string;
  ref: string;
  name: string;
  label: string;
  fields: readonly (keyof MenuEntryOverride)[];
}

interface MenuNode {
  item: MenuItem | null;
  container: MenuContainer;
  override: MenuEntryOverride;
}

type MenuContainer = MenuGroupId | MenuNode;

interface MenuForest {
  lists: Map<MenuContainer, MenuNode[]>;
  planted: Map<MenuContainer, number>;
  byKey: Map<string, MenuNode>;
  nodes: MenuNode[];
}

interface MenuPass {
  forest: MenuForest;
  known: ReadonlySet<string>;
  issues: MenuIssue[];
}

interface MenuAnchorPass extends MenuPass {
  done: Set<MenuNode>;
  stack: MenuNode[];
  looped: Set<MenuNode>;
}

interface MenuIssue {
  key: string;
  message: string;
}

interface MenuOverrideRecord {
  key: string;
  label: string;
  override: MenuEntryOverride;
  route?: string;
}

interface MenuHiddenState {
  routes: ReadonlySet<string>;
  setRoutes: (routes: ReadonlySet<string>) => void;
}

interface ResolvedMenu {
  entries: MenuEntry[];
  issues: MenuIssue[];
  overrides: MenuOverrideRecord[];
}

interface MenuResolveInput {
  groups: MenuGroups;
  config?: MenuConfig;
  known?: ReadonlySet<string>;
}

export type {
  BarMarker, MenuAnchorPass, MenuConfig, MenuContainer, MenuEntryOverride, MenuForest, MenuGroupId, MenuGroups, MenuHiddenState, MenuIssue, MenuNode, MenuOverrideRecord, MenuPass, MenuResolveInput,
  ResolvedMenu, TuckedRow,
};
