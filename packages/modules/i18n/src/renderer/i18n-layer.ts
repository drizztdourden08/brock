/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/i18n.json';

const i18nLayer: Layer = { locale: 'en', namespace: 'i18n', messages: english, kind: 'module' };

export { i18nLayer };
