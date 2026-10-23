/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { TesseraProvider } from '@drizztdourden08/tessera/primitives';
import { mergeModules } from '../../modules/merge-modules';
import { NO_TITLE_BAR_ITEMS } from '../../title-bar/title-bar.constants';
import { NO_TOURS } from '../../tours/tours.constants';
import { useTourRegistry } from '../../tours/useTourRegistry';
import { PlatformProvider } from '../../platform/PlatformProvider';
import { ScreenRegistryContext } from '../../screens/screen-registry-context';
import type { TabDef } from '../../settings/settings.type';
import { separateModuleTabs } from '../../settings/separate-module-tabs';
import { SettingsStoreContext } from '../../stores/settings-context';
import { BrockContext } from '../brock-context';
import type { BrockContextValue } from '../brock-context.type';
import { useAppScreens } from './behavior/useAppScreens';
import { useTesseraSetup } from './behavior/useTesseraSetup';
import { useHostBoot } from './behavior/useHostBoot';
import { useProfileSettingsStore } from './behavior/useProfileSettingsStore';
import { useAppGuards } from './behavior/useAppGuards';
import { useTitleBarSources } from './behavior/useTitleBarSources';
import { useSettingsControls } from './behavior/useSettingsControls';
import { AppShell } from './sub-components/AppShell';
import { WidgetWindow } from '../../widgets/WidgetWindow';
import { widgetWindowId } from '../../widgets/widget-window-id';
import { NO_WIDGETS } from '../../widgets/widget.constants';
import { NO_KITS } from '../../widgets/kits/widget-kit.constants';
import { ModuleProviders } from './sub-components/ModuleProviders';
import { NO_MODULES, NO_SHORTCUTS, NO_TABS } from './BrockApp.constants';
import { NO_BOOT_TASKS } from '../../boot/boot.constants';
import { useBugReportTransport } from '../../bug-report/useBugReportTransport';
import { useRendererLogging } from '../../log/useRendererLogging';
import { APP_FLAGS_SOURCE } from '../../screens/show/show.constants';
import { useShowFlagsSource } from '../../screens/show/useShowFlagsSource';
import type { BrockAppProps } from './BrockApp.type';
import { useAppCommands } from './behavior/useAppCommands';
import './BrockApp.css';

const BrockApp = <S extends object>(props: BrockAppProps<S>) => {
  const {
    product, settings, modules = NO_MODULES, bootTasks = NO_BOOT_TASKS, widgets = NO_WIDGETS, widgetKits = NO_KITS, widgetLayout, widgetContext, widgetDisabled, layout = 'menu',
    screenGroups, profileHooks, profiles, dataDomains, beforeQuit, review, titleBar = NO_TITLE_BAR_ITEMS, tours = NO_TOURS, bugReport, sessionLog, showFlags, volume, developerTools, restoreNavigation,
  } = props;

  const merged = useMemo(() => mergeModules(modules), [modules]);
  const poppedId = useMemo(widgetWindowId, []);
  const overrides = useTesseraSetup(product);
  const log = useHostBoot(merged.logChannels, profileHooks, dataDomains);
  useRendererLogging(log, { sessionLog, popped: poppedId !== null });
  useAppGuards(merged.beforeQuit, beforeQuit, profiles);
  useTourRegistry(tours, merged.tours);
  useBugReportTransport(bugReport);
  useShowFlagsSource(APP_FLAGS_SOURCE, showFlags);
  const titleBarActions = useTitleBarSources(merged.titleBarActions, titleBar);
  const allBootTasks = useMemo(() => [...merged.bootTasks, ...bootTasks], [merged.bootTasks, bootTasks]);
  const allWidgets = useMemo(() => [...merged.widgets, ...widgets], [merged.widgets, widgets]);
  const allKits = useMemo(() => [...merged.widgetKits, ...widgetKits], [merged.widgetKits, widgetKits]);
  useAppCommands(merged.commands, props.commands);
  const settingsStore = useProfileSettingsStore(settings, developerTools);

  const builtInTabs = useMemo(() => separateModuleTabs([...(settings.tabs ?? NO_TABS), ...merged.settingsTabs] as TabDef<object>[]), [settings.tabs, merged.settingsTabs]);
  const { base: home, registry, tree, tabs, menu, homeScreen } = useAppScreens({ ...props, builtInTabs, moduleScreens: merged.screens, productHome: product.homeScreen, profilesRoute: product.profilesRoute, singleProfile: product.singleProfile });
  const settingsControls = useSettingsControls(settings);

  const context = useMemo<BrockContextValue>(() => ({
    product, home, tabs, settingsControls, menu, homeScreen, shortcuts: tree?.shortcuts ?? NO_SHORTCUTS, screenTree: tree,
    logoSrc: product.logos.app, instanceLogoSrc: product.logos.instance, moduleIds: merged.ids,
  }), [product, home, tabs, settingsControls, menu, homeScreen, tree, merged.ids]);

  return (
    <TesseraProvider overrides={overrides}>
      <PlatformProvider ports={merged.ports}>
        <BrockContext.Provider value={context}>
          <ScreenRegistryContext.Provider value={registry}>
            <SettingsStoreContext.Provider value={settingsStore}>
              <ModuleProviders providers={merged.providers}>
                {poppedId !== null ? <WidgetWindow id={poppedId} widgets={allWidgets} widgetDisabled={widgetDisabled} /> : (
                  <AppShell
                    settingsStore={settingsStore}
                    bootTasks={allBootTasks}
                    log={log}
                    moduleIds={merged.ids}
                    moduleMenu={merged.menu}
                    titleBarActions={titleBarActions}
                    searchActions={merged.searchActions}
                    widgets={allWidgets} widgetKits={allKits}
                    widgetLayout={widgetLayout} widgetContext={widgetContext} widgetDisabled={widgetDisabled}
                    layout={layout}
                    screenGroups={screenGroups}
                    review={review} volume={volume ?? merged.volume} restoreNavigation={restoreNavigation}
                  />
                )}
              </ModuleProviders>
            </SettingsStoreContext.Provider>
          </ScreenRegistryContext.Provider>
        </BrockContext.Provider>
      </PlatformProvider>
    </TesseraProvider>
  );
};

export { BrockApp };
