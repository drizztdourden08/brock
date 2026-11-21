/* @layer core @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { ENGLISH } from './english-text.constants';

const englishText = (value: Text): string => ENGLISH.text(value);

export { englishText };
