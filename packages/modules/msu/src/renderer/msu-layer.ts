/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/msu.json';

const msuLayer: Layer = { locale: 'en', namespace: 'msu', messages: english, kind: 'module' };

export { msuLayer };
