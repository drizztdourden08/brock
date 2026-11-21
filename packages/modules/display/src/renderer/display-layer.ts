/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/display.json';

const displayLayer: Layer = { locale: 'en', namespace: 'display', messages: english, kind: 'module' };

export { displayLayer };
