/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/input.json';

const inputLayer: Layer = { locale: 'en', namespace: 'input', messages: english, kind: 'module' };

export { inputLayer };
