/* @layer renderer-shell @kind logic */
import type { LivePage } from '@drizztdourden08/brock-react';

const mergeExtraPages = (current: readonly LivePage[], incoming: readonly LivePage[]): readonly LivePage[] => {
  const incomingKeys = new Set(incoming.map((page) => page.key));
  return [...current.filter((page) => !incomingKeys.has(page.key)), ...incoming];
};

export { mergeExtraPages };
