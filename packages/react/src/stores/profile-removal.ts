/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import { getAppLog } from '../log/get-app-log';
import type { BeforeProfileRemove, ProfileRemovalRegistry } from './profiles.type';

const guards = new Set<BeforeProfileRemove>();

const ask = async (guard: BeforeProfileRemove, profile: Profile): Promise<boolean> => {
  try {
    return (await guard(profile)) !== false;
  } catch (error) {
    getAppLog().error(`onBeforeRemove threw, so profile "${profile.name}" stays: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

const profileRemoval: ProfileRemovalRegistry = {
  add: (guard) => {
    guards.add(guard);
    return () => { guards.delete(guard); };
  },
  allows: async (profile) => {
    for (const guard of [...guards]) {
      if (!(await ask(guard, profile))) return false;
    }
    return true;
  },
};

export { profileRemoval };
