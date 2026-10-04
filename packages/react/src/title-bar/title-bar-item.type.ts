/* @layer renderer-shell @kind types */
import type { IconName, StatusTone } from '@drizztdourden08/tessera/primitives';
import type { MenuEntry } from '../menu/menu.type';

interface TitleBarItemBase {
  label: string;
  icon: IconName;
}

interface TitleBarButtonSpec extends TitleBarItemBase {
  kind: 'button';
  onSelect: () => void;
  shortcut?: string;
  tone?: 'neutral' | 'danger';
}

interface TitleBarMenuSpec extends TitleBarItemBase {
  kind: 'menu';
  items: readonly MenuEntry[];
}

interface TitleBarStatusSpec extends TitleBarItemBase {
  kind: 'status';
  status: string | null;
  tone?: StatusTone;
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

interface TitleBarMenuOpen {
  id: string;
  items: readonly MenuEntry[];
  anchor: HTMLElement | null;
}

interface TitleBarMenuState {
  open: TitleBarMenuOpen | null;
  show: (open: TitleBarMenuOpen) => void;
  hide: () => void;
}

export type {
  TitleBarButtonSpec, TitleBarItemEntry, TitleBarItemHook, TitleBarItemSource, TitleBarItemSpec, TitleBarMenuSpec, TitleBarMenuState,
  TitleBarStatusSpec,
};
