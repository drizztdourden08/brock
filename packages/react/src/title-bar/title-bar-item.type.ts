/* @layer renderer-shell @kind types */
import type { IconEffect, IconName, StatusTone } from '@drizztdourden08/tessera/primitives';
import type { MenuEntry } from '../menu/menu.type';

interface TitleBarItemBase {
  label: string;
  icon: IconName;
  tone?: StatusTone;
  effect?: IconEffect;
}

interface TitleBarButtonSpec extends TitleBarItemBase {
  kind: 'button';
  onSelect: () => void;
  shortcut?: string;
}

interface TitleBarMenuGroup {
  label?: string;
  items: readonly MenuEntry[];
}

interface TitleBarMenuBase extends TitleBarItemBase {
  kind: 'menu';
}

type TitleBarMenuSpec = TitleBarMenuBase & ({ items: readonly MenuEntry[]; groups?: undefined } | { groups: readonly TitleBarMenuGroup[]; items?: undefined });

interface TitleBarStatusSpec extends TitleBarItemBase {
  kind: 'status';
  status: string | null;
  pulse?: boolean;
  onSelect?: () => void;
}

type TitleBarItemSpec = TitleBarButtonSpec | TitleBarMenuSpec | TitleBarStatusSpec;

type TitleBarItemHook = () => TitleBarItemSpec | null;

type TitleBarItemSource = TitleBarItemSpec | TitleBarItemHook;

interface TitleBarItemEntry {
  id: string;
  source: TitleBarItemSource;
}

export type {
  TitleBarButtonSpec, TitleBarItemEntry, TitleBarItemHook, TitleBarItemSource, TitleBarItemSpec, TitleBarMenuGroup, TitleBarMenuSpec,
  TitleBarStatusSpec,
};
