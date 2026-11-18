/* @layer renderer-shell @kind constants */
import { FALLBACK_I18N } from '../i18n/i18n-context.constants';
import type { ControlSources } from './control-sources.type';

const NO_CONTROL_SOURCES: ControlSources = { tabs: [], settings: null, screens: null, tree: null, text: (value) => FALLBACK_I18N.text(value) };

export { NO_CONTROL_SOURCES };
