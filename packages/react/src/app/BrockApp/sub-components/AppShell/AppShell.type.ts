/* @layer renderer-shell @kind types */
import type { AppLogBus } from '../../../../log/app-log.type';
import type { MenuEntry } from '../../../../menu/menu.type';
import type { ScreenRailGroup } from '../../../../shell/ScreenRail/ScreenRail.type';
import type { SettingsStore } from '../../../../stores/settings-store.type';
import type { BrockAppLayout } from '../../BrockApp.type';

interface AppShellProps<S extends object> {
  settingsStore: SettingsStore<S>;
  log: AppLogBus;
  moduleMenu: readonly MenuEntry[];
  layout?: BrockAppLayout;
  screenGroups?: readonly ScreenRailGroup[];
}

export type { AppShellProps };
