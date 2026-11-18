/* @layer electron-main @kind logic */
import { getAppState, saveAppState } from '@drizztdourden08/brock-core/storage';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { cleanPreference } from '../preference/clean-preference';
import { broadcastState } from './broadcast-state';
import { stateFor } from './state-for';

const registerI18nHandlers = (ctx: Pick<MainContext, 'handle' | 'files' | 'i18n'>): void => {
  const { handle, files, i18n } = ctx;
  handle('i18n:get', async () => stateFor(cleanPreference((await getAppState(files)).locale)));
  handle('i18n:set', async (_event, preference) => {
    const next = cleanPreference(preference);
    await saveAppState(files, { ...(await getAppState(files)), locale: next });
    const state = stateFor(next);
    await i18n.setLocale(state.locale);
    broadcastState(state);
    return state;
  });
};

export { registerI18nHandlers };
