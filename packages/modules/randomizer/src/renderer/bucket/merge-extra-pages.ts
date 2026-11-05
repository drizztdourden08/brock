/* @layer renderer-shell @kind logic */
import type { RandomizerPage } from './randomizer-page.type';

const mergeExtraPages = (current: readonly RandomizerPage[], incoming: readonly RandomizerPage[]): readonly RandomizerPage[] => {
  const incomingKeys = new Set(incoming.map((page) => page.key));
  return [...current.filter((page) => !incomingKeys.has(page.key)), ...incoming];
};

export { mergeExtraPages };
