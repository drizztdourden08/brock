/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import type { I18nValue } from './i18n.type';
import { I18nContext } from './i18n-context';

const useI18n = (): I18nValue => useContext(I18nContext);

export { useI18n };
