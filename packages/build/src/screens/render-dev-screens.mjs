/* @layer tooling-scripts @kind logic */
import { entryLine, importLines, isLazy } from './screen-entry-lines.mjs';
import { GENERATED_HEADER, LAZY_COMPONENT, REACT_PACKAGE } from './screen-conventions.constants.mjs';
import { fileSeed } from './search/file-seed.mjs';

const list = (lines) => (lines.length ? ['[', ...lines, ']'].join('\n') : '[]');

/**
 * @param {string} rootDir
 * @param {import('./scan-screens.mjs').ScreenFile[]} files the dev-only screen files
 * @returns {string} .brock/screens.dev.ts: entries and seeds
 */
const renderDevScreens = (rootDir, files) => [
  GENERATED_HEADER,
  ...(files.some(isLazy) ? [`import { ${LAZY_COMPONENT} } from '${REACT_PACKAGE}';`] : []),
  `import type { ScreenEntry, SearchFileSeed } from '${REACT_PACKAGE}';`,
  ...files.flatMap(importLines),
  '',
  `const devScreens: ScreenEntry[] = ${list(files.map(entryLine))};`,
  '',
  `const devSearchSeeds: SearchFileSeed[] = ${list(files.map((file) => `  ${JSON.stringify(fileSeed(rootDir, file))},`))};`,
  '',
  'export { devScreens, devSearchSeeds };',
  '',
].join('\n');

export { renderDevScreens };
