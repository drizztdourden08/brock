/* @layer renderer-shell @kind hook */
import { useId, useLayoutEffect, useSyncExternalStore } from 'react';
import { hostClaim } from '../../host-claim';

const useHostClaim = (): boolean => {
  const id = useId();
  const owner = useSyncExternalStore(hostClaim.subscribe, hostClaim.owner, hostClaim.owner);
  useLayoutEffect(() => hostClaim.claim(id), [id]);
  return owner === null || owner === id;
};

export { useHostClaim };
