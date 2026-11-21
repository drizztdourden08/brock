/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/tools.json';

const toolsLayer: Layer = { locale: 'en', namespace: 'tools', messages: english, kind: 'module' };

export { toolsLayer };
