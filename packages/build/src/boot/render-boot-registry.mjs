/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, TASK_SUFFIX } from './boot.constants.mjs';

/**
 * @param {string} id
 * @returns {string}
 */
const identifierOf = (id) => `${id.replace(/-(.)/g, (_, c) => c.toUpperCase())}Task`;

/**
 * @param {{ dir: string, type: string, from: string, name: string }} side
 * @param {string[]} ids
 * @returns {string}  The managed registry listing the side's boot tasks
 */
const renderBootRegistry = ({ dir, type, from, name }, ids) => {
  const imports = ids.map((id) => `import ${identifierOf(id)} from '../${dir}/${id}${TASK_SUFFIX.replace(/\.ts$/, '')}';`);
  const list = ids.length ? `[\n${ids.map((id) => `  { ...${identifierOf(id)}, id: '${id}' },`).join('\n')}\n]` : '[]';
  return [GENERATED_HEADER, `import type { ${type} } from '${from}';`, ...imports, '', `const ${name}: ${type}[] = ${list};`, '', `export { ${name} };`, ''].join('\n');
};

export { renderBootRegistry };
