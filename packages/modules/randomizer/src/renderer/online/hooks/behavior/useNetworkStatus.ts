/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { useProfilesStore } from '@drizztdourden08/brock-react';
import type { NetworkStatus } from '../../../../archipelago';
import { lastNetworkStatus } from '../../last-network-status';
import { useOnlineClient } from './useOnlineClient';

const useNetworkStatus = (): NetworkStatus | null => {
  const client = useOnlineClient();
  const profileId = useProfilesStore((state) => state.active?.id ?? null);
  const [live, setLive] = useState<NetworkStatus | null>(null);
  useEffect(() => {
    if (client === null) {
      setLive(null);
      return undefined;
    }
    const read = (): void => {
      const status = client.status();
      setLive(status);
      if (profileId !== null) lastNetworkStatus.remember(profileId, status);
    };
    read();
    return client.subscribe(read);
  }, [client, profileId]);
  if (live !== null) return live;
  return profileId === null ? null : lastNetworkStatus.get(profileId);
};

export { useNetworkStatus };
