/* @layer renderer-shell @kind logic */
import { useDeveloperToolsStore } from './useDeveloperToolsStore';

const developerTools = {
  bound: (): boolean => useDeveloperToolsStore.getState().binding !== null,
  set: (on: boolean): boolean => {
    const { binding } = useDeveloperToolsStore.getState();
    binding?.set(on);
    return binding !== null;
  },
};

export { developerTools };
