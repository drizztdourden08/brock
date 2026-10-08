/* @layer renderer-shell @kind types */
import type { NativePlugin } from '@drizztdourden08/brock-core';
import type { SyncedRateStatus } from '../../display.type';

interface NativeDisplayInfo {
  currentHz: number;
  supportedHz: number[];
  preferredHz: number;
  width: number;
  height: number;
  density: number;
}

interface PreferredRateResult {
  applied: boolean;
  reason?: string;
}

interface BrockDisplayPlugin extends NativePlugin {
  getDisplayInfo: () => Promise<NativeDisplayInfo>;
  setPreferredRate: (request: { hz: number }) => Promise<PreferredRateResult>;
}

interface AndroidRateState {
  enabled: boolean;
  targetHz: number;
  activeHz: number | null;
  lastError: string;
}

interface AndroidRates {
  status: () => Promise<SyncedRateStatus>;
  setPreference: (enabled: boolean, targetHz: number) => Promise<SyncedRateStatus>;
  apply: (hz: number) => Promise<SyncedRateStatus>;
}

export type { NativeDisplayInfo, BrockDisplayPlugin, AndroidRateState, AndroidRates };
