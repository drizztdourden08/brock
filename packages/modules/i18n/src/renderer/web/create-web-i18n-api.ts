/* @layer renderer-shell @kind logic */
import type { I18nApi, I18nStateListener } from '../../i18n.type';
import { cleanPreference } from '../../preference/clean-preference';
import { webState } from './web-state';
import { writeWebPreference } from './write-web-preference';

const createWebI18nApi = (): I18nApi => {
  const listeners = new Set<I18nStateListener>();
  return {
    get: () => Promise.resolve(webState()),
    set: (preference) => {
      const next = cleanPreference(preference);
      writeWebPreference(next);
      const state = webState(next);
      for (const listener of listeners) listener(state);
      return Promise.resolve(state);
    },
    onChanged: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export { createWebI18nApi };
