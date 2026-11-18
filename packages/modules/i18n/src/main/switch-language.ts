/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { LANG_SWITCH } from './i18n-main.constants';
import { readStoredPreference } from './read-stored-preference';
import { stateFor } from './state-for';

const switchLanguage = (ctx: MainContext): void => {
  const { locale } = stateFor(readStoredPreference());
  app.commandLine.appendSwitch(LANG_SWITCH, locale);
  ctx.i18n.setLocale(locale).catch((error: unknown) => ctx.log(`i18n: boot locale ${locale} failed: ${String(error)}`, 'warn'));
};

export { switchLanguage };
