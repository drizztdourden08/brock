/* @layer electron-main @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../../locales/en/brock-main.json';

const brockMainLayer: Layer = { locale: 'en', namespace: 'brock-main', messages: english, kind: 'package' };

export { brockMainLayer };
