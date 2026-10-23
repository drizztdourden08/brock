/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { DataDomainDef, ProductConfig, ProfileStoreHooks } from '@drizztdourden08/brock-core';
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import type { MenuConfig, MenuIssue, MenuOverrideRecord } from '../../menu/menu-config.type';
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { EscapeStack } from '@drizztdourden08/tessera/primitives';
import type { RendererModule } from '../../modules/renderer-module.type';
import type { RendererBootTask } from '../../boot/renderer-boot.type';
import type { BeforeQuit, OnBeforeQuit } from '../../quit/quit.type';
import type { TitleBarItemEntry } from '../../title-bar/title-bar-item.type';
import type { ResolvedScreenTree, ScreenTree } from '../../screens/conventions/screen-tree.type';
import type { ScreenRegistry } from '../../screens/screen-registry.type';
import type { ScreenDef } from '../../screens/screen.type';
import type { ScreenRailGroup } from '../../shell/ScreenRail/ScreenRail.type';
import type { SettingsEffect, SettingsNormalise, SettingsPatchTransform } from '../../stores/settings-store.type';
import type { SettingsControlProps, TabDef } from '../../settings/settings.type';
import type { LayoutPreset } from '../../widgets/layout-preset.type';
import type { WidgetContextSource, WidgetDisabledHook } from '../../widgets/WidgetHost/WidgetHost.type';
import type { WidgetDef } from '../../widgets/widget.type';
import type { WidgetKitDef } from '../../widgets/kits/widget-kit.type';
import type { AppReview } from '../../review/app-review.type';
import type { TourChoice, TourDef } from '../../tours/tour.type';
import type { BrockAppBugReport } from '../../bug-report/bug-report.type';
import type { ShowContext, ShowFlagValues } from '../../screens/show/show.type';
import type { BeforeProfileRemove } from '../../stores/profiles.type';
import type { VolumeSource } from '../../volume/volume.type';
import type { DeveloperToolsSource } from '../../developer-tools/developer-tools.type';
import type { CommandDef } from '../../commands/command.type';
import type { RouteShortcut } from '../../navigation/navigation.type';
import type { MenuBarMenu } from '../../menu-bar/menu-bar.type';

type BrockAppLayout = 'menu' | 'rail';

type SettingsControls<S extends object> = Pick<SettingsControlProps<S>, 'renderControl' | 'isDisabled' | 'lockCauseOf' | 'lockOverlay'>;

interface BrockAppSettings<S extends object> extends SettingsControls<S> {
  defaults: S;
  tabs?: TabDef<S>[];
  effects?: SettingsEffect<S>[];
  normalise?: SettingsNormalise<S>;
  transformPatch?: SettingsPatchTransform<S>;
}

interface BrockAppProfiles {
  onBeforeRemove?: BeforeProfileRemove;
}

interface BrockAppProps<S extends object> {
  product: ProductConfig;
  settings: BrockAppSettings<S>;
  screens?: ScreenDef[];
  screenTree?: ScreenTree;
  modules?: RendererModule[];
  bootTasks?: RendererBootTask[];
  widgets?: readonly WidgetDef[];
  widgetKits?: readonly WidgetKitDef[];
  widgetLayout?: LayoutPreset;
  widgetContext?: WidgetContextSource;
  widgetDisabled?: WidgetDisabledHook;
  home?: string;
  menu?: MenuEntry[];
  layout?: BrockAppLayout;
  screenGroups?: ScreenRailGroup[];
  profileHooks?: ProfileStoreHooks;
  profiles?: BrockAppProfiles;
  dataDomains?: readonly DataDomainDef[];
  homeScreen?: string;
  restoreNavigation?: boolean;
  credits?: ReactNode;
  legalText?: string;
  beforeQuit?: BeforeQuit;
  onBeforeQuit?: OnBeforeQuit;
  titleBar?: readonly TitleBarItemEntry[];
  review?: AppReview;
  tours?: readonly TourDef[];
  bugReport?: BrockAppBugReport;
  sessionLog?: boolean;
  showFlags?: ShowFlagValues;
  volume?: VolumeSource;
  developerTools?: DeveloperToolsSource;
  commands?: readonly CommandDef[];
  menuBar?: readonly MenuBarMenu[];
}

interface MenuBuildInput {
  appMenu: readonly MenuEntry[];
  moduleMenu: readonly MenuEntry[];
  widgets: readonly MenuItem[];
  homeScreen: string;
  homeLocked?: boolean;
  singleProfile?: boolean;
  hasCredits: boolean;
  developerTools: boolean;
  show?: ShowContext;
  onQuit: () => void;
  onDevConsole: () => void;
  onReportBug: () => void;
  onShortcuts: () => void;
  tours?: { list: readonly TourChoice[]; start: (id: string) => void };
  menuConfig?: MenuConfig;
  locked?: (route: string) => boolean;
}

interface ShellMenu {
  menu: MenuEntry[];
  searchable: MenuEntry[];
  all: MenuEntry[];
  issues: MenuIssue[];
  overrides: MenuOverrideRecord[];
}

interface ShellKeyContext {
  home: () => string | null;
  holds?: () => boolean;
  reopenable?: () => boolean;
  escapes: EscapeStack;
}

type EscapeContext = Pick<ShellKeyContext, 'home' | 'holds' | 'reopenable'>;

interface RouteCommandsInput {
  registry: ScreenRegistry;
  shortcuts: readonly RouteShortcut[];
  allowed: (screen: ScreenDef | undefined) => boolean;
  labelOf: (target: string) => string;
}

interface AppScreensInput {
  home?: string;
  screens?: readonly ScreenDef[];
  screenTree?: ScreenTree;
  builtInTabs: TabDef<object>[];
  moduleScreens: readonly ScreenDef[];
  menu?: readonly MenuEntry[];
  homeScreen?: string;
  productHome: string;
  profilesRoute?: string;
  singleProfile?: boolean;
  credits?: ReactNode;
  legalText?: string;
}

interface AppScreens {
  base: string;
  registry: ScreenRegistry;
  tree: ResolvedScreenTree | null;
  tabs: TabDef<object>[];
  menu: MenuEntry[];
  homeScreen: string;
}

interface ReviewTourInput {
  ready: boolean;
  menu: readonly MenuEntry[];
  menuOverrides?: readonly MenuOverrideRecord[];
  actions?: readonly WindowTitleBarAction[];
  moduleIds: readonly string[];
  review?: AppReview;
}

export type {
  AppScreens, AppScreensInput, BrockAppLayout, BrockAppProfiles, BrockAppProps, BrockAppSettings, EscapeContext, MenuBuildInput, ReviewTourInput, RouteCommandsInput, ShellKeyContext,
  ShellMenu,
};
