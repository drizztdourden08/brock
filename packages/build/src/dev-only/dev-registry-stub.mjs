/* @layer tooling-scripts @kind logic */
import { EXPORT_LIST } from './dev-only.constants.mjs';

const exportedNames = (source) => [...source.matchAll(EXPORT_LIST)]
  .flatMap((match) => match[1].split(','))
  .map((part) => part.trim())
  .filter((part) => part && !part.startsWith('type '))
  .map((part) => part.split(/\s+as\s+/).at(-1).trim());

/**
 * @param {string} source a generated .brock/<name>.dev.ts
 * @returns {string} the same exports, each an empty list
 */
const devRegistryStub = (source) => {
  const names = [...new Set(exportedNames(source))];
  return [...names.map((name) => `const ${name} = [];`), `export { ${names.join(', ')} };`, ''].join('\n');
};

export { devRegistryStub };
