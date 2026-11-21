/* @layer core @kind constants */
import { createI18n } from '@drizztdourden08/brock-core/i18n';
import { randomizerLayer } from './randomizer-layer';

const ENGLISH = createI18n({ base: 'en', layers: [randomizerLayer] });

export { ENGLISH };
