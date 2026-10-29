/* @layer tooling-scripts @kind logic */

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const spellings = (path) => [...new Set([path, path.split('\\').join('/')])].sort((a, b) => b.length - a.length);

/**
 * @param {unknown} value a config part, any depth
 * @param {[string, string][]} roots each folder and the token that stands for it
 * @returns {unknown} the same value with every spelling of the folders replaced
 */
const portableValue = (value, roots) => {
  const rules = roots.flatMap(([root, token]) => spellings(root).map((form) => [new RegExp(escape(form), 'gi'), token]));
  const visit = (item) => {
    if (typeof item === 'string') return rules.reduce((text, [pattern, token]) => text.replace(pattern, token), item);
    if (Array.isArray(item)) return item.map(visit);
    if (item && typeof item === 'object') return Object.fromEntries(Object.entries(item).map(([key, inner]) => [visit(key), visit(inner)]));
    return item;
  };
  return visit(value);
};

export { portableValue };
