/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER } from '../boot/boot.constants.mjs';
import { HANDLERS_DEV_NAME, HANDLERS_DEV_OUTPUT, HANDLERS_DIR, HANDLERS_FROM, HANDLERS_NAME, HANDLERS_OUTPUT } from './handlers.constants.mjs';
import { scanHandlers } from './scan-handlers.mjs';

const importOf = ({ file, name }) => `import { ${name} } from '../${HANDLERS_DIR}/${file.replace(/\.ts$/, '')}';`;

/**
 * @param {string} listName
 * @param {{ file: string, name: string }[]} groups
 * @param {string[]} [spread] lists spread after the groups
 * @param {string[]} [extraImports]
 * @returns {string}
 */
const renderList = (listName, groups, spread = [], extraImports = []) => {
  const items = [...groups.map(({ name }) => name), ...spread.map((name) => `...${name}`)];
  return [
    GENERATED_HEADER, `import type { HandlerGroup } from '${HANDLERS_FROM}';`, ...extraImports, ...groups.map(importOf), '',
    `const ${listName}: HandlerGroup[] = [${items.join(', ')}];`, '', `export { ${listName} };`, '',
  ].join('\n');
};

/**
 * @param {string} rootDir  The app root
 * @returns {{ path: string, content: string | null }[]}  handlers.main.ts and handlers.main.dev.ts
 */
const renderHandlersFiles = (rootDir) => {
  const groups = scanHandlers(rootDir);
  const dev = groups.filter((group) => group.dev);
  const devImport = `import { ${HANDLERS_DEV_NAME} } from './${HANDLERS_DEV_OUTPUT.split('/').at(-1).replace(/\.ts$/, '')}';`;
  const main = dev.length
    ? renderList(HANDLERS_NAME, groups.filter((group) => !group.dev), [HANDLERS_DEV_NAME], [devImport])
    : renderList(HANDLERS_NAME, groups);
  return [{ path: HANDLERS_OUTPUT, content: main }, { path: HANDLERS_DEV_OUTPUT, content: dev.length ? renderList(HANDLERS_DEV_NAME, dev) : null }];
};

export { renderHandlersFiles };
