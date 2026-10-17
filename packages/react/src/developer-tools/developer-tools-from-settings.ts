/* @layer renderer-shell @kind logic */
import { patchAt } from '../volume/patch-at';
import { readPath } from '../volume/read-path';
import type { DeveloperToolsBindingFactory } from './developer-tools.type';

const developerToolsFromSettings = (key: string): DeveloperToolsBindingFactory => (store) => {
  const settings = (): object => store.getState().settings;
  return {
    get: () => readPath(settings(), key) === true,
    set: (on) => store.getState().patch(patchAt(settings(), [[key, on]])),
    subscribe: (listener) => store.subscribe((state, prev) => {
      if (state.settings !== prev.settings) listener();
    }),
  };
};

export { developerToolsFromSettings };
