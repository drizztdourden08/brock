/* @layer renderer-shell @kind logic */
import type { LocaleSource } from '@drizztdourden08/brock-react';
import { DEFAULT_BASE_LOCALE } from '../i18n.constants';
import { cleanPreference } from '../preference/clean-preference';
import { effectiveLocale } from './effective-locale';
import { i18nApi } from './i18n-api';
import { SYSTEM_VALUE } from './i18n-renderer.constants';
import { useLocaleChoice } from './useLocaleChoice';

const current = (): string => effectiveLocale(useLocaleChoice.getState()) ?? DEFAULT_BASE_LOCALE;

const createLocaleSource = (): LocaleSource => ({
  initial: async () => {
    useLocaleChoice.getState().setApp(await i18nApi().get());
    return current();
  },
  set: async (preference) => {
    const state = await i18nApi().set(preference === SYSTEM_VALUE ? null : cleanPreference(preference));
    useLocaleChoice.getState().setApp(state);
  },
  subscribe: (listener) => i18nApi().onChanged((state) => {
    useLocaleChoice.getState().setApp(state);
    listener(current());
  }),
});

export { createLocaleSource };
