/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE, SCREENS_CONFIG, SCREENS_DIR } from '../screen-conventions.constants.mjs';
import { fileSeed } from './file-seed.mjs';

/**
 * @param {string} rootDir
 * @param {import('../scan-screens.mjs').ScreenFile[]} files
 * @returns {string} the source of .brock/search.ts
 */
const renderSearch = (rootDir, files) => {
  const seeds = files.map((file) => `  ${JSON.stringify(fileSeed(rootDir, file))},`);
  const list = seeds.length ? ['[', ...seeds, ']'].join('\n') : '[]';
  return [
    GENERATED_HEADER,
    `import { buildSearchIndex } from '${REACT_PACKAGE}';`,
    `import config from '../${SCREENS_DIR}/${SCREENS_CONFIG.replace(/\.ts$/, '')}';`,
    '',
    `const searchIndex = buildSearchIndex(config, ${list});`,
    '',
    'export { searchIndex };',
    '',
  ].join('\n');
};

export { renderSearch };
