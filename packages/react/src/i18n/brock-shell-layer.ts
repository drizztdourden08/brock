/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/brock-shell.json';

const brockShellLayer: Layer = { locale: 'en', namespace: 'brock-shell', messages: english, kind: 'package' };

export { brockShellLayer };
