/* @layer tooling-scripts @kind constants */
const LOCALES_DIR = 'src/locales';
const LOCALES_OUTPUT = '.brock/locales.ts';
const LOCALES_CHUNK_DIR = '.brock/locales';
const LOCALES_MAIN_OUTPUT = '.brock/locales.main.ts';
const MESSAGES_TYPE_OUTPUT = '.brock/messages.type.ts';
const DEFAULT_BASE = 'en';
const I18N_PACKAGE = '@drizztdourden08/brock-i18n';
const CORE_I18N = '@drizztdourden08/brock-core/i18n';
const CORE_AUGMENT = '@drizztdourden08/brock-core/augment';
const ELECTRON_MAIN = '@drizztdourden08/brock-electron/main';
const LOCALE_TAG = /^[a-z]{2,3}(?:-[A-Z][a-z]{3})?(?:-(?:[A-Z]{2}|\d{3}))?$/;
const NAMESPACE = /^[a-z][a-z0-9-]*$/;
const MAIN_NAMESPACE = /(?:^|-)main$/;
const ELECTRON_BASE_LANGUAGE = 'en-US';
const OPTIONS_PATTERN = /i18n:\s*\{([^}]*)\}/;
const FOLDER_HINT = 'src/locales holds one folder per language tag, each with <namespace>.json files';

export { CORE_AUGMENT, CORE_I18N, DEFAULT_BASE, ELECTRON_BASE_LANGUAGE, ELECTRON_MAIN, FOLDER_HINT, I18N_PACKAGE, LOCALE_TAG, LOCALES_CHUNK_DIR, LOCALES_DIR, LOCALES_MAIN_OUTPUT, LOCALES_OUTPUT, MAIN_NAMESPACE, MESSAGES_TYPE_OUTPUT, NAMESPACE, OPTIONS_PATTERN };
