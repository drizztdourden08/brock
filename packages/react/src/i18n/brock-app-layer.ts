/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/brock-app.json';

const brockAppLayer: Layer = { locale: 'en', namespace: 'brock-app', messages: english, kind: 'package' };

export { brockAppLayer };
