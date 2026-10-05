/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE } from '../screens/screen-conventions.constants.mjs';
import { scanTours } from './scan-tours.mjs';
import { TOURS_OUTPUT } from './tour-conventions.constants.mjs';

/** @param {string} id */
const identifierOf = (id) => `${id.split('-').map((word, index) => (index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)).join('')}Tour`;

/**
 * @param {{ id: string, path: string }[]} files
 * @returns {string} the content of .brock/tours.ts
 */
const renderTours = (files) => {
  const imports = files.map((file) => `import ${identifierOf(file.id)} from '../${file.path.replace(/\.ts$/, '')}';`);
  const list = files.length ? ['[', ...files.map((file) => `  { id: '${file.id}', tour: ${identifierOf(file.id)} },`), ']'].join('\n') : '[]';
  return [
    GENERATED_HEADER,
    `import { toursFromFiles } from '${REACT_PACKAGE}';`,
    ...imports,
    '',
    `const appTours = toursFromFiles(${list});`,
    '',
    'export { appTours };',
    '',
  ].join('\n');
};

/**
 * @param {string} rootDir the app root
 * @returns {{ path: string, content: string }[]} .brock/tours.ts, always
 */
const renderToursFiles = (rootDir) => [{ path: TOURS_OUTPUT, content: renderTours(scanTours(rootDir).files.filter((file) => file.hasDefault)) }];

export { renderTours, renderToursFiles };
