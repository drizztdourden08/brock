/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { nav } from '../../../navigation/nav';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useBrock } from '../../useBrock';

const useOpenHomeOnStart = (settled: boolean): void => {
  const { home, homeScreen, screenTree } = useBrock();
  const registry = useScreenRegistry();

  useEffect(() => {
    if (!settled || screenTree === null || registry.has(home)) return;
    if (nav.active() !== null || useProfilesStore.getState().active === null) return;
    nav.open(homeScreen);
  }, [settled]);
};

export { useOpenHomeOnStart };
