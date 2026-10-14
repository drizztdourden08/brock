/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { DataDomainDef, ProductConfig, ProfileStoreHooks } from '@drizztdourden08/brock-core';
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { EscapeStack } from '@drizztdourden08/tessera/primitives';
import type { RendererModule } from '../../modules/renderer-module.type';
import type { RendererBootTask } from '../../boot/renderer-boot.type';
import type { BeforeQuit } from '../../quit/quit.type';
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
import type { AppReview } from '../../review/app-review.type';
import type { TourChoice, TourDef } from '../../tours/tour.type';
import type { BrockAppBugReport } from '../../bug-report/bug-report.type';
import type { ShowContext } from '../../screens/show/show.type';

type BrockAppLayout = 'menu' | 'rail';

type SettingsControls<S extends object> = Pick<SettingsControlProps<S>, 'renderControl' | 'isDisabled' | 'lockCauseOf' | 'lockOverlay'>;

interface BrockAppSettings<S extends object> extends SettingsControls<S> {
  defaults: S;
  tabs?: TabDef<S>[];
  effects?: SettingsEffect<S>[];
  normalise?: SettingsNormalise<S>;
  transformPatch?: SettingsPatchTransform<S>;
}

interface BrockAppProps<S extends object> {
  product: ProductConfig;
  settings: BrockAppSettings<S>;
  screens?: ScreenDef[];
  screenTree?: ScreenTree;
  modules?: RendererModule[];
  bootTasks?: RendererBootTask[];
  widgets?: readonly WidgetDef[];
  widgetLayout?: LayoutPreset;
  widgetContext?: WidgetContextSource;
  widgetDisabled?: WidgetDisabledHook;
  home?: string;
  menu?: MenuEntry[];
  layout?: BrockAppLayout;
  screenGroups?: ScreenRailGroup[];
  profileHooks?: ProfileStoreHooks;
  dataDomains?: readonly DataDomainDef[];
  homeScreen?: string;
  credits?: ReactNode;
  legalText?: string;
  beforeQuit?: BeforeQuit;
  titleBar?: readonly TitleBarItemEntry[];
  review?: AppReview;
  tours?: readonly TourDef[];
  bugReport?: BrockAppBugReport;
  sessionLog?: boolean;
}

interface MenuBuildInput {
  appMenu: readonly MenuEntry[];
  moduleMenu: readonly MenuEntry[];
  widgets: readonly MenuItem[];
  homeScreen: string;
  hasCredits: boolean;
  developerTools: boolean;
  show?: ShowContext;
  onQuit: () => void;
  onDevConsole: () => void;
  onReportBug: () => void;
  onShortcuts: () => void;
  tours?: { list: readonly TourChoice[]; start: (id: string) => void };
}

interface ShellKeyContext {
  toggleFullscreen?: () => void;
  home: () => string | null;
  escapes: EscapeStack;
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
  actions?: readonly WindowTitleBarAction[];
  moduleIds: readonly string[];
  review?: AppReview;
}

export type { AppScreens, AppScreensInput, BrockAppLayout, BrockAppProps, BrockAppSettings, MenuBuildInput, ReviewTourInput, ShellKeyContext };
