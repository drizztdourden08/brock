/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { currentShowContext } from '../screens/show/current-show-context';
import type { ShowContext } from '../screens/show/show.type';
import { useShowFlagsStore } from '../screens/show/useShowFlagsStore';
import { useProfilesStore } from '../stores/useProfilesStore';

const useRuleContext = (): ShowContext => {
  const profile = useProfilesStore((s) => s.active);
  const flags = useShowFlagsStore((s) => s.flags);
  return useMemo(() => currentShowContext(), [profile, flags]);
};

export { useRuleContext };
