/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { mergeModules } from '../../modules/merge-modules';
import { PlatformProvider } from '../../platform/PlatformProvider';
import { createBuiltInScreens } from '../../screens/built-in/built-in-screens';
import { createScreenRegistry } from '../../screens/create-screen-registry';
import { ScreenRegistryContext } from '../../screens/screen-registry-context';
import type { TabDef } from '../../settings/settings.type';
import { SettingsStoreContext } from '../../stores/settings-context';
import { BrockContext } from '../brock-context';
import type { BrockContextValue, SettingsControlsValue } from '../brock-context.type';
import { useHostBoot } from './behavior/useHostBoot';
import { useProfileSettingsStore } from './behavior/useProfileSettingsStore';
import { AppShell } from './sub-components/AppShell';
import { ModuleProviders } from './sub-components/ModuleProviders';
import { NO_MENU, NO_MODULES } from './BrockApp.constants';
import type { BrockAppProps } from './BrockApp.type';
import './BrockApp.css';

const BrockApp = <S extends object>(props: BrockAppProps<S>) => {
  const {
    product, settings, screens, modules = NO_MODULES, home, menu = NO_MENU, layout = 'menu', screenGroups,
    profileHooks, homeScreen = product.homeScreen, credits, legalText,
  } = props;

  const merged = useMemo(() => mergeModules(modules), [modules]);
  const log = useHostBoot(merged.logChannels, profileHooks);
  const settingsStore = useProfileSettingsStore(settings);

  const tabs = useMemo(
    () => [...settings.tabs, ...merged.settingsTabs] as TabDef<object>[],
    [settings.tabs, merged.settingsTabs],
  );

  const registry = useMemo(() => {
    const all = createScreenRegistry([...screens, ...merged.screens]);
    for (const screen of createBuiltInScreens({ legalText, credits })) {
      if (!all.has(screen.id)) all.register(screen);
    }
    return all;
  }, [screens, merged.screens, legalText, credits]);

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
      product, home, tabs, settingsControls, menu, homeScreen,
      logoSrc: product.logos.app, instanceLogoSrc: product.logos.instance,
    }),
    [product, home, tabs, settingsControls, menu, homeScreen],
  );

  return (
    <PlatformProvider ports={merged.ports}>
      <BrockContext.Provider value={context}>
        <ScreenRegistryContext.Provider value={registry}>
          <SettingsStoreContext.Provider value={settingsStore}>
            <ModuleProviders providers={merged.providers}>
              <AppShell
                settingsStore={settingsStore}
                log={log}
                moduleMenu={merged.menu}
                layout={layout}
                screenGroups={screenGroups}
              />
            </ModuleProviders>
          </SettingsStoreContext.Provider>
        </ScreenRegistryContext.Provider>
      </BrockContext.Provider>
    </PlatformProvider>
  );
};

export { BrockApp };
