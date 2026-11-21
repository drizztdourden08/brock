/* @layer renderer-shell @kind logic */
import { foldText } from './fold-text';
import { EDGE_PUNCTUATION, WORD_SPLIT } from './search.constants';

const normaliseKeywords = (value: unknown): string[] => {
  const list: unknown[] = Array.isArray(value) ? value : [value];
  const words = list.filter((item): item is string => typeof item === 'string').flatMap((item) => foldText(item).split(WORD_SPLIT));
  return [...new Set(words.map((word) => word.replace(EDGE_PUNCTUATION, '')).filter((word) => word !== ''))];
};

export { normaliseKeywords };
