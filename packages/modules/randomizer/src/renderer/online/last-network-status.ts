/* @layer renderer-shell @kind logic */
import type { NetworkStatus } from '../../archipelago';

const kept = new Map<string, NetworkStatus>();

const lastNetworkStatus = {
  get: (profileId: string): NetworkStatus | null => kept.get(profileId) ?? null,
  remember: (profileId: string, status: NetworkStatus): void => {
    kept.set(profileId, status);
  },
};

export { lastNetworkStatus };
