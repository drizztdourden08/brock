/* @layer core @kind types */
interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: Record<string, unknown>;
}

interface HostGlobals {
  window?: { Capacitor?: CapacitorGlobal; api?: unknown };
}

export type { CapacitorGlobal, HostGlobals };
