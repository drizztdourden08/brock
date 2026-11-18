/* @layer renderer-shell @kind constants */
import { DEFAULT_BASE_LOCALE } from '../../i18n.constants';
import type { WebLocales } from './web-locales.type';

const WEB_LOCALES: WebLocales = { base: DEFAULT_BASE_LOCALE, tags: [DEFAULT_BASE_LOCALE] };

export { WEB_LOCALES };
