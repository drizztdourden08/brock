/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { quitGuards } from '../../../quit/quit-guards';
import type { QuitGuardSources } from './useQuitGuards.type';

const useQuitGuards = ({ moduleSync, moduleAsync, sync, async }: QuitGuardSources): void => {
  useEffect(() => {
    const removers = [
      ...[...moduleSync, ...(sync ? [sync] : [])].map((guard) => quitGuards.add(guard)),
      ...[...moduleAsync, ...(async ? [async] : [])].map((guard) => quitGuards.addAsync(guard)),
    ];
    return () => { for (const remove of removers) remove(); };
  }, [moduleSync, moduleAsync, sync, async]);
};

export { useQuitGuards };
