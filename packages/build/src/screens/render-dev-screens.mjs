/* @layer tooling-scripts @kind logic */
import { entryLine, importLine } from './screen-entry-lines.mjs';
import { GENERATED_HEADER, REACT_PACKAGE } from './screen-conventions.constants.mjs';
import { fileSeed } from './search/file-seed.mjs';

const list = (lines) => (lines.length ? ['[', ...lines, ']'].join('\n') : '[]');

/**
 * @param {string} rootDir
 * @param {import('./scan-screens.mjs').ScreenFile[]} files the dev-only screen files
 * @returns {string} .brock/screens.dev.ts: entries and seeds
 */
const renderDevScreens = (rootDir, files) => [
  GENERATED_HEADER,
  `import type { ScreenEntry, SearchFileSeed } from '${REACT_PACKAGE}';`,
  ...files.map(importLine),
  '',
  `const devScreens: ScreenEntry[] = ${list(files.map(entryLine))};`,
  '',
  `const devSearchSeeds: SearchFileSeed[] = ${list(files.map((file) => `  ${JSON.stringify(fileSeed(rootDir, file))},`))};`,
  '',
  'export { devScreens, devSearchSeeds };',
  '',
].join('\n');

export { renderDevScreens };
