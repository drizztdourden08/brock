/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { usePlatform } from '../../platform/usePlatform';
import { useProfilesStore } from '../../stores/useProfilesStore';
import type { ShowContext } from './show.type';
import { useShowFlagsStore } from './useShowFlagsStore';
import { useStickyShowParams } from './useStickyShowParams';

const useShowContext = (): ShowContext => {
  const profile = useProfilesStore((s) => s.active);
  const flags = useShowFlagsStore((s) => s.flags);
  const params = useStickyShowParams();
  const { info } = usePlatform();
  return useMemo(() => ({ profile, host: info.host, formFactor: info.formFactor, flags, params }), [profile, info, flags, params]);
};

export { useShowContext };
