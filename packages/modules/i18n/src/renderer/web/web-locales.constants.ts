/* @layer renderer-shell @kind constants */
import { DEFAULT_BASE_LOCALE } from '../../i18n.constants';

type WebLocales = { base: string; tags: readonly string[] };

const WEB_LOCALES: WebLocales = { base: DEFAULT_BASE_LOCALE, tags: [DEFAULT_BASE_LOCALE] };

export { WEB_LOCALES };
