/* @layer renderer-shell @kind types */
import type { FirewallStatus } from '../../../ipc/lan-host-api.type';

interface NetworkAccess {
  status: FirewallStatus;
  recheck: () => void;
  allow: () => void;
}

export type { NetworkAccess };
