/* @layer core @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import english from '../locales/en/randomizer.json';

const randomizerLayer: Layer = { locale: 'en', namespace: 'randomizer', messages: english, kind: 'module' };

export { randomizerLayer };
