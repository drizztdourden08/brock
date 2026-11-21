/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { normaliseKeywords } from './normalise-keywords';

const seedKeywords = (value: readonly (Text | undefined)[] | undefined): Text[] => {
  const list = value ?? [];
  const messages = list.filter((item): item is Exclude<Text, string> => typeof item === 'object');
  return [...normaliseKeywords(list), ...messages];
};

export { seedKeywords };
