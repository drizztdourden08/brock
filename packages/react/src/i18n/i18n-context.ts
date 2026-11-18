/* @layer renderer-shell @kind logic */
import { createContext } from 'react';
import { createI18n } from '@drizztdourden08/brock-core/i18n';
import type { I18nValue } from './i18n.type';
import { DEFAULT_BASE_LOCALE } from './brock-layers.constants';

const FALLBACK_I18N = createI18n({ base: DEFAULT_BASE_LOCALE });

const I18nContext = createContext<I18nValue>({ i18n: FALLBACK_I18N, locale: DEFAULT_BASE_LOCALE });

export { I18nContext };
