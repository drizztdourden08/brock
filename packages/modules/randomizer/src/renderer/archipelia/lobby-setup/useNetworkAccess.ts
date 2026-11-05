/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { FirewallStatus } from '../../../ipc/lan-host-api.type';
import { randomizerApi } from '../socket/randomizer-api';
import type { NetworkAccess } from './useNetworkAccess.type';

const useNetworkAccess = (on: boolean): NetworkAccess => {
  const [status, setStatus] = useState<FirewallStatus>('unknown');

  const recheck = useCallback(() => {
    void randomizerApi()?.lan.firewallStatus().then(setStatus);
  }, []);

  const allow = useCallback(() => {
    void randomizerApi()?.lan.allowFirewall().then(setStatus);
  }, []);

  useEffect(() => {
    if (on) recheck();
  }, [on, recheck]);

  return { status, recheck, allow };
};

export { useNetworkAccess };
