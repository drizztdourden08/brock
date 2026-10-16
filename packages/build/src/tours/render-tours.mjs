/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE } from '../screens/screen-conventions.constants.mjs';
import { scanTours } from './scan-tours.mjs';
import { LAZY_TOUR, TOURS_OUTPUT } from './tour-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, shell?: Record<string, unknown> | null }} RenderedTour
 */

/** @param {string} id */
const identifierOf = (id) => `${id.split('-').map((word, index) => (index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)).join('')}Tour`;

/** @param {RenderedTour} file */
const sourceOf = (file) => `../${file.path.replace(/\.ts$/, '')}`;

/** @param {RenderedTour} file */
const tourOf = (file) => (file.shell ? `${LAZY_TOUR}(${JSON.stringify(file.shell)}, () => import('${sourceOf(file)}'))` : identifierOf(file.id));

/**
 * @param {RenderedTour[]} files
 * @returns {string} the content of .brock/tours.ts
 */
const renderTours = (files) => {
  const imports = files.filter((file) => !file.shell).map((file) => `import ${identifierOf(file.id)} from '${sourceOf(file)}';`);
  const list = files.length ? ['[', ...files.map((file) => `  { id: '${file.id}', tour: ${tourOf(file)} },`), ']'].join('\n') : '[]';
  const helpers = [...(files.some((file) => file.shell) ? [LAZY_TOUR] : []), 'toursFromFiles'];
  return [
    GENERATED_HEADER,
    `import { ${helpers.join(', ')} } from '${REACT_PACKAGE}';`,
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
