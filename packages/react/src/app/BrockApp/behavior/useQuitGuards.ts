/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { quitGuards } from '../../../quit/quit-guards';
import type { BeforeQuit } from '../../../quit/quit.type';

const useQuitGuards = (fromModules: readonly BeforeQuit[], fromApp: BeforeQuit | undefined): void => {
  useEffect(() => {
    const removers = [...fromModules, ...(fromApp ? [fromApp] : [])].map((guard) => quitGuards.add(guard));
    return () => { for (const remove of removers) remove(); };
  }, [fromModules, fromApp]);
};

export { useQuitGuards };
