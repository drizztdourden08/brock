/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/secrets.json';

const secretsLayer: Layer = { locale: 'en', namespace: 'secrets', messages: english, kind: 'module' };

export { secretsLayer };
