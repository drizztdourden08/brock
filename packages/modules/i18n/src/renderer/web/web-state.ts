/* @layer renderer-shell @kind logic */
import type { I18nState } from '../../i18n.type';
import { buildState } from '../../preference/build-state';
import { readWebPreference } from './read-web-preference';
import { WEB_LOCALES } from './web-locales.constants';

const webState = (preference: string | null = readWebPreference()): I18nState =>
  buildState({ preference, systemTags: navigator.languages, offered: WEB_LOCALES.tags, base: WEB_LOCALES.base });

export { webState };
