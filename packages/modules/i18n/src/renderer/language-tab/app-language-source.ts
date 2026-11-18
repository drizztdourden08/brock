/* @layer renderer-shell @kind logic */
import type { LocaleSource, SettingsValueSource } from '@drizztdourden08/brock-react';
import { SYSTEM_VALUE } from '../i18n-renderer.constants';
import { useLocaleChoice } from '../useLocaleChoice';

const appLanguageSource = (source: LocaleSource): SettingsValueSource => ({
  get: () => useLocaleChoice.getState().app?.preference ?? SYSTEM_VALUE,
  set: (_key, value) => source.set(String(value)),
  subscribe: (listener) => useLocaleChoice.subscribe(listener),
});

export { appLanguageSource };
