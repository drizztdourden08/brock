/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import type { I18nValue } from './i18n.type';
import { DEFAULT_BASE_LOCALE } from './brock-layers.constants';
import { FALLBACK_I18N } from './i18n-context.constants';

const I18nContext = createContext<I18nValue>({ i18n: FALLBACK_I18N, locale: DEFAULT_BASE_LOCALE });

export { I18nContext };
