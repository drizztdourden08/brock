/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER } from '../boot/boot.constants.mjs';
import { HANDLERS_DIR, HANDLERS_FROM, HANDLERS_NAME, HANDLERS_OUTPUT } from './handlers.constants.mjs';
import { scanHandlers } from './scan-handlers.mjs';

/**
 * @param {{ file: string, name: string }[]} groups
 * @returns {string}  The content of .brock/handlers.main.ts
 */
const renderHandlers = (groups) => {
  const imports = groups.map(({ file, name }) => `import { ${name} } from '../${HANDLERS_DIR}/${file.replace(/\.ts$/, '')}';`);
  const list = groups.length ? `[${groups.map(({ name }) => name).join(', ')}]` : '[]';
  return [GENERATED_HEADER, `import type { HandlerGroup } from '${HANDLERS_FROM}';`, ...imports, '', `const ${HANDLERS_NAME}: HandlerGroup[] = ${list};`, '', `export { ${HANDLERS_NAME} };`, ''].join('\n');
};

/**
 * @param {string} rootDir  The app root
 * @returns {{ path: string, content: string }[]}  .brock/handlers.main.ts, always
 */
const renderHandlersFiles = (rootDir) => [{ path: HANDLERS_OUTPUT, content: renderHandlers(scanHandlers(rootDir)) }];

export { renderHandlersFiles };
