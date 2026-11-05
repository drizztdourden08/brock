/* @layer core @kind types */
import type { LanSightingSource } from '../archipelago/lobby';

type FirewallStatus = 'allowed' | 'blocked' | 'unknown';

type RandomizerLanApi = LanSightingSource & {
  firewallStatus: () => Promise<FirewallStatus>;
  allowFirewall: () => Promise<FirewallStatus>;
};

export type { FirewallStatus, RandomizerLanApi };
