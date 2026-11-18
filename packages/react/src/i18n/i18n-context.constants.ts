/* @layer renderer-shell @kind constants */
import { createI18n } from '@drizztdourden08/brock-core/i18n';
import { DEFAULT_BASE_LOCALE } from './brock-layers.constants';
import { BROCK_REACT_LAYERS } from './brock-react-layers.constants';

const FALLBACK_I18N = createI18n({ base: DEFAULT_BASE_LOCALE, layers: BROCK_REACT_LAYERS });

export { FALLBACK_I18N };
