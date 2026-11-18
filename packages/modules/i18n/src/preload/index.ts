/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import { I18N_MODULE_ID } from '../i18n.constants';
import type { I18nApi } from '../i18n.type';

const buildI18nApi = ({ invoke, subscribe }: BridgeTools): I18nApi => ({
  get: () => invoke('i18n:get'),
  set: (preference) => invoke('i18n:set', preference),
  onChanged: (listener) => subscribe('i18n:changed', listener),
});

const i18nPreload: PreloadNamespace = {
  id: I18N_MODULE_ID,
  build: buildI18nApi,
};

export default i18nPreload;
export { i18nPreload, buildI18nApi };
export type { I18nApi } from '../i18n.type';
