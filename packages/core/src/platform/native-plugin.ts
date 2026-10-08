/* @layer core @kind logic */
import type { HostGlobals } from './detect.type';
import type { NativePlugin } from './native-plugin.type';

const nativePlugin = <T extends NativePlugin>(name: string): T | null => {
  const capacitor = (globalThis as HostGlobals).window?.Capacitor;
  if (!capacitor?.isNativePlatform?.()) return null;
  const plugin = capacitor.Plugins?.[name];
  return plugin ? (plugin as T) : null;
};

export { nativePlugin };
