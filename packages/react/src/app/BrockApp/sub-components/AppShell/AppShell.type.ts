/* @layer renderer-shell @kind types */
import type { AppLogBus } from '../../../../log/app-log.type';
import type { MenuEntry } from '../../../../menu/menu.type';
import type { TitleBarActionSource } from '../../../../modules/renderer-module.type';
import type { SearchAction } from '../../../../search/search.type';
import type { ScreenRailGroup } from '../../../../shell/ScreenRail/ScreenRail.type';
import type { SettingsStore } from '../../../../stores/settings-store.type';
import type { LayoutPreset } from '../../../../widgets/layout-preset.type';
import type { WidgetContextSource, WidgetDisabledHook } from '../../../../widgets/WidgetHost/WidgetHost.type';
import type { WidgetDef } from '../../../../widgets/widget.type';
import type { WidgetKitDef } from '../../../../widgets/kits/widget-kit.type';
import type { ToolbarDef } from '../../../../toolbars/toolbar.type';
import type { RendererBootTask } from '../../../../boot/renderer-boot.type';
import type { AppReview } from '../../../../review/app-review.type';
import type { StartupPromptDef } from '../../../../startup/startup.type';
import type { VolumeSource } from '../../../../volume/volume.type';
import type { MenuBarMenu } from '../../../../menu-bar/menu-bar.type';
import type { BrockAppLayout } from '../../BrockApp.type';

interface AppShellProps<S extends object> {
  settingsStore: SettingsStore<S>;
  bootTasks: readonly RendererBootTask[];
  log: AppLogBus;
  moduleIds?: readonly string[];
  moduleMenu: readonly MenuEntry[];
  titleBarActions?: readonly TitleBarActionSource[];
  searchActions?: readonly SearchAction[];
  widgets?: readonly WidgetDef[];
  widgetKits?: readonly WidgetKitDef[];
  toolbars?: readonly ToolbarDef[];
  widgetLayout?: LayoutPreset;
  widgetContext?: WidgetContextSource;
  widgetDisabled?: WidgetDisabledHook;
  layout?: BrockAppLayout;
  screenGroups?: readonly ScreenRailGroup[];
  review?: AppReview;
  startupPrompts: readonly StartupPromptDef[];
  volume?: VolumeSource;
  restoreNavigation?: boolean;
  menuBar?: readonly MenuBarMenu[];
}

export type { AppShellProps };
