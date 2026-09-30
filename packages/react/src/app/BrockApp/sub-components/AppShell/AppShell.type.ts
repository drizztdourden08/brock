/* @layer renderer-shell @kind types */
import type { AppLogBus } from '../../../../log/app-log.type';
import type { MenuEntry } from '../../../../menu/menu.type';
import type { TitleBarSlot } from '../../../../modules/renderer-module.type';
import type { SearchAction } from '../../../../search/search.type';
import type { ScreenRailGroup } from '../../../../shell/ScreenRail/ScreenRail.type';
import type { SettingsStore } from '../../../../stores/settings-store.type';
import type { WidgetDef } from '../../../../widgets/widget.type';
import type { RendererBootTask } from '../../../../boot/renderer-boot.type';
import type { BrockAppLayout } from '../../BrockApp.type';

interface AppShellProps<S extends object> {
  settingsStore: SettingsStore<S>;
  bootTasks: readonly RendererBootTask[];
  log: AppLogBus;
  moduleIds?: readonly string[];
  moduleMenu: readonly MenuEntry[];
  titleBarSlots?: readonly TitleBarSlot[];
  searchActions?: readonly SearchAction[];
  widgets?: readonly WidgetDef[];
  layout?: BrockAppLayout;
  screenGroups?: readonly ScreenRailGroup[];
}

export type { AppShellProps };
