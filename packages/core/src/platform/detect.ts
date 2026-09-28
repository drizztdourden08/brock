/* @layer core @kind logic */
import type { HostShell } from './platform.type';
import type { CapacitorGlobal, HostGlobals } from './detect.type';

const hostWindow = (): HostGlobals['window'] => (globalThis as unknown as HostGlobals).window;

const capacitor = (): CapacitorGlobal | undefined => hostWindow()?.Capacitor;

const hasPreloadApi = (): boolean => Boolean(hostWindow()?.api);

const detectHost = (): HostShell => {
  if (capacitor()?.isNativePlatform?.()) return 'capacitor';
  if (hasPreloadApi()) return 'electron';
  return 'web';
};

export { detectHost };
