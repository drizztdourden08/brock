/* @layer core @kind logic */
const ancestors = (tag: string): string[] => {
  const parts = tag.split('-');
  return parts.map((_, drop) => parts.slice(0, parts.length - drop).join('-'));
};

const fallbackChain = (tag: string, tail: readonly string[] = []): readonly string[] => [
  ...new Set([...ancestors(tag), ...tail.flatMap(ancestors)]),
];

export { fallbackChain };
