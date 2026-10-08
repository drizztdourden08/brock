/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { renderDevScreens } from './render-dev-screens.mjs';
import { scanScreens } from './scan-screens.mjs';
import { entryLine, importLine } from './screen-entry-lines.mjs';
import { GENERATED_HEADER, REACT_PACKAGE, SCREENS_CONFIG, SCREENS_DEV_OUTPUT, SCREENS_DIR, SCREENS_OUTPUT, SEARCH_OUTPUT } from './screen-conventions.constants.mjs';
import { renderSearch } from './search/render-search.mjs';

const DEV_IMPORT = "import { devScreens } from './screens.dev';";

/**
 * @param {import('./scan-screens.mjs').ScreenFile[]} files every screen file, dev-only too
 * @returns {string}
 */
const renderScreens = (files) => {
  const shipped = files.filter((file) => !file.dev);
  const hasDev = shipped.length < files.length;
  const lines = [...shipped.map(entryLine), ...(hasDev ? ['  ...devScreens,'] : [])];
  const list = lines.length ? ['[', ...lines, ']'].join('\n') : '[]';
  return [
    GENERATED_HEADER,
    `import { buildScreenTree } from '${REACT_PACKAGE}';`,
    `import config from '../${SCREENS_DIR}/${SCREENS_CONFIG.replace(/\.ts$/, '')}';`,
    "import { searchIndex } from './search';",
    ...(hasDev ? [DEV_IMPORT] : []),
    ...shipped.map(importLine),
    '',
    `const screenTree = buildScreenTree(config, ${list}, searchIndex);`,
    '',
    'export { screenTree };',
    '',
  ].join('\n');
};

/**
 * @param {string} rootDir
 * @returns {{ path: string, content: string | null }[]} screens.ts, search.ts, screens.dev.ts
 */
const renderScreensFiles = (rootDir) => {
  if (!existsSync(join(rootDir, SCREENS_DIR, SCREENS_CONFIG))) return [];
  const { files } = scanScreens(rootDir);
  const dev = files.filter((file) => file.dev);
  return [
    { path: SCREENS_OUTPUT, content: renderScreens(files) },
    { path: SEARCH_OUTPUT, content: renderSearch(rootDir, files) },
    { path: SCREENS_DEV_OUTPUT, content: dev.length ? renderDevScreens(rootDir, dev) : null },
  ];
};

export { renderScreens, renderScreensFiles };
