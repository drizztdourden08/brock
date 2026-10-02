/* @layer tooling-scripts @kind logic */
const EXPORT_FROM = /^export\s+(type\s+)?\{([^}]*)\}\s+from\s+(['"])\.{1,2}\/[^'"]+\3$/;

const statementsOf = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')
  .split(';')
  .map((statement) => statement.replace(/\s+/g, ' ').trim())
  .filter(Boolean);

const exportedNames = (list) => list.split(',').map((name) => name.trim().split(/\s+as\s+/).pop()).filter(Boolean);

/**
 * @param {string} source  a barrel index.ts
 * @returns {{ values: string[], types: string[] } | null} its exports, or null when it holds anything but export { ... } from './...'
 */
const barrelExports = (source) => {
  const found = { values: [], types: [] };
  for (const statement of statementsOf(source)) {
    const match = EXPORT_FROM.exec(statement);
    if (!match) return null;
    found[match[1] ? 'types' : 'values'].push(...exportedNames(match[2]));
  }
  return found;
};

export { barrelExports };
