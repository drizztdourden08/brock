/* @layer renderer-shell @kind types */
import type { IconEffect, IconName, StatusTone } from '@drizztdourden08/tessera/primitives';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { MenuEntryDef } from '../menu/menu.type';

interface TitleBarItemBase {
  label: Text;
  icon: IconName;
  tone?: StatusTone;
  effect?: IconEffect;
}

interface TitleBarButtonSpec extends TitleBarItemBase {
  kind: 'button';
  onSelect?: () => void;
  command?: string;
  shortcut?: string;
  disabled?: boolean;
  disabledReason?: Text;
}

type TitleBarButtonLook = Omit<TitleBarButtonSpec, 'onSelect'>;

interface TitleBarMenuGroup {
  label?: Text;
  items: readonly MenuEntryDef[];
}

interface TitleBarMenuBase extends TitleBarItemBase {
  kind: 'menu';
}

type TitleBarMenuSpec = TitleBarMenuBase & ({ items: readonly MenuEntryDef[]; groups?: undefined } | { groups: readonly TitleBarMenuGroup[]; items?: undefined });

interface TitleBarStatusSpec extends TitleBarItemBase {
  kind: 'status';
  status: Text | null;
  pulse?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  disabledReason?: Text;
}

interface TitleBarVolumeSpec {
  kind: 'volume';
  label: Text;
  value: number;
  muted: boolean;
  onChange: (value: number) => void;
  onMuteToggle: () => void;
  shortcut?: string;
}

type TitleBarItemSpec = TitleBarButtonSpec | TitleBarMenuSpec | TitleBarStatusSpec | TitleBarVolumeSpec;

type TitleBarItemHook = () => TitleBarItemSpec | null;

type TitleBarItemSource = TitleBarItemSpec | TitleBarItemHook;

interface TitleBarActionsMenu {
  id?: string;
  label: Text;
  icon: IconName;
}

interface TitleBarItemEntry {
  id: string;
  source: TitleBarItemSource;
  order?: number;
}

interface TitleBarItemMeta {
  order?: number;
}

export type {
  TitleBarActionsMenu, TitleBarButtonLook, TitleBarButtonSpec, TitleBarItemEntry, TitleBarItemHook, TitleBarItemMeta, TitleBarItemSource, TitleBarItemSpec, TitleBarMenuGroup, TitleBarMenuSpec,
  TitleBarStatusSpec, TitleBarVolumeSpec,
};
