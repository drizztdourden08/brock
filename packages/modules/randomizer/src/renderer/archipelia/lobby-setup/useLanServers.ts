/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { watchLanServers } from '../../../archipelago/lobby';
import type { LanServer } from '../../../archipelago/lobby';
import { randomizerApi } from '../socket/randomizer-api';

const useLanServers = (on: boolean, refresh = 0): LanServer[] => {
  const [servers, setServers] = useState<LanServer[]>([]);

  useEffect(() => {
    const lan = randomizerApi()?.lan;
    if (!on || lan === undefined) return undefined;
    setServers([]);
    return watchLanServers(lan, setServers);
  }, [on, refresh]);

  return servers;
};

export { useLanServers };
