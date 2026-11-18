/* @layer renderer-shell @kind logic */
import type { SettingsValueSource } from '@drizztdourden08/brock-react';
import { APP_VALUE } from '../i18n-renderer.constants';
import { useLocaleChoice } from '../useLocaleChoice';

const profileLanguageSource = (): SettingsValueSource => ({
  get: () => useLocaleChoice.getState().profile ?? APP_VALUE,
  set: (_key, value) => {
    useLocaleChoice.getState().patchProfile?.(value === APP_VALUE ? '' : String(value));
  },
  subscribe: (listener) => useLocaleChoice.subscribe(listener),
});

export { profileLanguageSource };
