/* @layer core @kind types */
interface CapacitorGlobal {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
}

interface HostGlobals {
  window?: { Capacitor?: CapacitorGlobal; api?: unknown };
}

export type { CapacitorGlobal, HostGlobals };
