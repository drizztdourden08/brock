/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import { nav } from '../navigation/nav';
import { confirmAction } from '../stores/confirm-action';
import { confirmChoice } from '../stores/confirm-choice';
import { confirmSave } from '../stores/confirm-save';
import type { SettingsStore } from '../stores/settings-store.type';
import type { StartupPromptContext } from './startup.type';

const startupContext = <S extends object>(profile: Profile, store: SettingsStore<S>): StartupPromptContext => ({
  confirmAction,
  confirmChoice,
  confirmSave,
  profile,
  settings: {
    get: () => store.getState().settings,
    patch: (patch) => store.getState().patch(patch),
    flush: () => store.flush(),
  },
  nav,
});

export { startupContext };
