/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { usePlatform } from '../../platform/usePlatform';
import { useProfilesStore } from '../../stores/useProfilesStore';
import type { ShowContext } from './show.type';

const useShowContext = (): ShowContext => {
  const profile = useProfilesStore((s) => s.active);
  const { info } = usePlatform();
  return useMemo(() => ({ profile, host: info.host, formFactor: info.formFactor }), [profile, info]);
};

export { useShowContext };
