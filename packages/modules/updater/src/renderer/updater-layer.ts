/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/updater.json';

const updaterLayer: Layer = { locale: 'en', namespace: 'updater', messages: english, kind: 'module' };

export { updaterLayer };
