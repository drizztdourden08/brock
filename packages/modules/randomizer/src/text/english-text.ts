/* @layer core @kind logic */
import { createI18n } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { randomizerLayer } from './randomizer-layer';

const ENGLISH = createI18n({ base: 'en', layers: [randomizerLayer] });

const englishText = (value: Text): string => ENGLISH.text(value);

export { englishText };
