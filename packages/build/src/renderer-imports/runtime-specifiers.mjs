/* @layer tooling-scripts @kind logic */
const STATEMENT = /^\s*(import|export)\s+([^'";]*?)\s*from\s*['"]([^'"]+)['"]/gm;
const BARE = /^\s*import\s*['"]([^'"]+)['"]/gm;

/**
 * @param {string} clause  What sits between import or export and from
 * @returns {boolean}  True when the statement brings in types only
 */
const typeOnly = (clause) => {
  if (/^type\b/.test(clause)) return true;
  const named = /^\{([^}]*)\}$/.exec(clause.trim());
  if (!named) return false;
  const parts = named[1].split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length > 0 && parts.every((part) => part.startsWith('type '));
};

/**
 * @param {string} source
 * @returns {string[]}  What the file loads at runtime, types left out
 */
const runtimeSpecifiers = (source) => [
  ...[...source.matchAll(STATEMENT)].filter((match) => !typeOnly(match[2])).map((match) => match[3]),
  ...[...source.matchAll(BARE)].map((match) => match[1]),
];

export { runtimeSpecifiers };
