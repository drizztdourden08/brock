/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/catalog.json';

const catalogLayer: Layer = { locale: 'en', namespace: 'catalog', messages: english, kind: 'module' };

export { catalogLayer };
