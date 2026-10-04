/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { TesseraProvider } from '@drizztdourden08/tessera/primitives';
import { mergeModules } from '../../modules/merge-modules';
import { STANDARD_TITLE_BAR_ACTIONS } from '../../overlays/standard-title-bar-actions.constants';
import { PlatformProvider } from '../../platform/PlatformProvider';
import { ScreenRegistryContext } from '../../screens/screen-registry-context';
import type { TabDef } from '../../settings/settings.type';
import { SettingsStoreContext } from '../../stores/settings-context';
import { BrockContext } from '../brock-context';
import type { BrockContextValue, SettingsControlsValue } from '../brock-context.type';
import { useAppScreens } from './behavior/useAppScreens';
import { useBrandPalette } from './behavior/useBrandPalette';
import { useHostBoot } from './behavior/useHostBoot';
import { useProfileSettingsStore } from './behavior/useProfileSettingsStore';
import { useQuitGuards } from './behavior/useQuitGuards';
import { AppShell } from './sub-components/AppShell';
import { WidgetWindow } from '../../widgets/WidgetWindow';
import { widgetWindowId } from '../../widgets/widget-window-id';
import { NO_WIDGETS } from '../../widgets/widget.constants';
import { ModuleProviders } from './sub-components/ModuleProviders';
import { NO_BACKGROUND, NO_MODULES, NO_SHORTCUTS, NO_TABS, TESSERA_OVERRIDES } from './BrockApp.constants';
import { NO_BOOT_TASKS } from '../../boot/boot.constants';
import type { BrockAppProps } from './BrockApp.type';
import './BrockApp.css';

const BrockApp = <S extends object>(props: BrockAppProps<S>) => {
  const { product, settings, modules = NO_MODULES, bootTasks = NO_BOOT_TASKS, widgets = NO_WIDGETS, widgetLayout, widgetContext, home = NO_BACKGROUND, layout = 'menu', screenGroups, profileHooks, beforeQuit } = props;

  const merged = useMemo(() => mergeModules(modules), [modules]);
  const poppedId = useMemo(widgetWindowId, []);
  useBrandPalette(product.icons.brand);
  const log = useHostBoot(merged.logChannels, profileHooks);
  useQuitGuards(merged.beforeQuit, beforeQuit);
  const titleBarActions = useMemo(() => [...STANDARD_TITLE_BAR_ACTIONS, ...merged.titleBarActions], [merged.titleBarActions]);
  const allBootTasks = useMemo(() => [...merged.bootTasks, ...bootTasks], [merged.bootTasks, bootTasks]);
  const allWidgets = useMemo(() => [...merged.widgets, ...widgets], [merged.widgets, widgets]);
  const settingsStore = useProfileSettingsStore(settings);
  const appTabs = settings.tabs ?? NO_TABS;

  const builtInTabs = useMemo(() => [...appTabs, ...merged.settingsTabs] as TabDef<object>[], [appTabs, merged.settingsTabs]);
  const { registry, tree, tabs, menu, homeScreen } = useAppScreens({ ...props, builtInTabs, moduleScreens: merged.screens, productHome: product.homeScreen });

  const settingsControls = useMemo<SettingsControlsValue>(
    () => ({
      renderControl: settings.renderControl as SettingsControlsValue['renderControl'],
      isDisabled: settings.isDisabled as SettingsControlsValue['isDisabled'],
      lockCauseOf: settings.lockCauseOf as SettingsControlsValue['lockCauseOf'],
      lockOverlay: settings.lockOverlay,
    }),
    [settings.renderControl, settings.isDisabled, settings.lockCauseOf, settings.lockOverlay],
  );

  const context = useMemo<BrockContextValue>(
    () => ({
      product, home, tabs, settingsControls, menu, homeScreen, shortcuts: tree?.shortcuts ?? NO_SHORTCUTS, screenTree: tree,
      logoSrc: product.logos.app, instanceLogoSrc: product.logos.instance, moduleIds: merged.ids,
    }),
    [product, home, tabs, settingsControls, menu, homeScreen, tree, merged.ids],
  );

  return (
    <TesseraProvider overrides={TESSERA_OVERRIDES}>
      <PlatformProvider ports={merged.ports}>
        <BrockContext.Provider value={context}>
          <ScreenRegistryContext.Provider value={registry}>
            <SettingsStoreContext.Provider value={settingsStore}>
              <ModuleProviders providers={merged.providers}>
                {poppedId !== null ? <WidgetWindow id={poppedId} widgets={allWidgets} /> : (
                  <AppShell
                    settingsStore={settingsStore}
                    bootTasks={allBootTasks}
                    log={log}
                    moduleIds={merged.ids}
                    moduleMenu={merged.menu}
                    titleBarActions={titleBarActions}
                    searchActions={merged.searchActions}
                    widgets={allWidgets}
                    widgetLayout={widgetLayout} widgetContext={widgetContext}
                    layout={layout}
                    screenGroups={screenGroups}
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
