/* @layer electron-main @kind logic */
import { app } from 'electron';
import { offeredLocales } from '@drizztdourden08/brock-electron/main';
import { DEFAULT_BASE_LOCALE } from '../i18n.constants';
import type { I18nState } from '../i18n.type';
import { buildState } from '../preference/build-state';

const stateFor = (preference: string | null): I18nState => {
  const offered = offeredLocales();
  return buildState({
    preference,
    systemTags: app.getPreferredSystemLanguages(),
    offered,
    base: offered[0] ?? DEFAULT_BASE_LOCALE,
  });
};

export { stateFor };
