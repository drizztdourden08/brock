/* @layer renderer-shell @kind logic */
import { nativePlugin } from '@drizztdourden08/brock-core';
import { windowGlobal } from '../../../host/window-global';
import { PLUGINS } from './capacitor.constants';
import type { AppPlugin, CapacitorCore, FilesystemPlugin, HapticsPlugin, KeepAwakePlugin } from './capacitor-plugins.type';

const platformName = (): string => {
  const core = windowGlobal.read('Capacitor') as CapacitorCore | undefined;
  return core?.getPlatform?.() ?? 'unknown';
};

const capacitorPlugins = {
  files: (): FilesystemPlugin | null => nativePlugin<FilesystemPlugin>(PLUGINS.files),
  app: (): AppPlugin | null => nativePlugin<AppPlugin>(PLUGINS.app),
  haptics: (): HapticsPlugin | null => nativePlugin<HapticsPlugin>(PLUGINS.haptics),
  keepAwake: (): KeepAwakePlugin | null => nativePlugin<KeepAwakePlugin>(PLUGINS.keepAwake),
  platform: platformName,
};

export { capacitorPlugins };
