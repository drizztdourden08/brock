/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE, SCREENS_CONFIG, SCREENS_DIR } from '../screen-conventions.constants.mjs';
import { fileSeed } from './file-seed.mjs';

/**
 * @param {string} rootDir
 * @param {import('../scan-screens.mjs').ScreenFile[]} files every screen file, dev-only too
 * @returns {string} the source of .brock/search.ts
 */
const renderSearch = (rootDir, files) => {
  const shipped = files.filter((file) => !file.dev);
  const hasDev = shipped.length < files.length;
  const seeds = [...shipped.map((file) => `  ${JSON.stringify(fileSeed(rootDir, file))},`), ...(hasDev ? ['  ...devSearchSeeds,'] : [])];
  const list = seeds.length ? ['[', ...seeds, ']'].join('\n') : '[]';
  return [
    GENERATED_HEADER,
    `import { buildSearchIndex } from '${REACT_PACKAGE}';`,
    `import config from '../${SCREENS_DIR}/${SCREENS_CONFIG.replace(/\.ts$/, '')}';`,
    ...(hasDev ? ["import { devSearchSeeds } from './screens.dev';"] : []),
    '',
    `const searchIndex = buildSearchIndex(config, ${list});`,
    '',
    'export { searchIndex };',
    '',
  ].join('\n');
};

export { renderSearch };
