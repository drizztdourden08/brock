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
  onSelect?: () => void;
  command?: string;
  shortcut?: string;
}

type TitleBarButtonLook = Omit<TitleBarButtonSpec, 'onSelect'>;

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

interface TitleBarVolumeSpec {
  kind: 'volume';
  label: string;
  value: number;
  muted: boolean;
  onChange: (value: number) => void;
  onMuteToggle: () => void;
  shortcut?: string;
}

type TitleBarItemSpec = TitleBarButtonSpec | TitleBarMenuSpec | TitleBarStatusSpec | TitleBarVolumeSpec;

type TitleBarItemHook = () => TitleBarItemSpec | null;

type TitleBarItemSource = TitleBarItemSpec | TitleBarItemHook;

interface TitleBarItemEntry {
  id: string;
  source: TitleBarItemSource;
  order?: number;
}

interface TitleBarItemMeta {
  order?: number;
}

export type {
  TitleBarButtonLook, TitleBarButtonSpec, TitleBarItemEntry, TitleBarItemHook, TitleBarItemMeta, TitleBarItemSource, TitleBarItemSpec, TitleBarMenuGroup, TitleBarMenuSpec,
  TitleBarStatusSpec, TitleBarVolumeSpec,
};
