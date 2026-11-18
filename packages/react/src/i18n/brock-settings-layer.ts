/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/brock-settings.json';

const brockSettingsLayer: Layer = { locale: 'en', namespace: 'brock-settings', messages: english, kind: 'package' };

export { brockSettingsLayer };
