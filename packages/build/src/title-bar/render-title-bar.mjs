/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE } from '../screens/screen-conventions.constants.mjs';
import { scanTitleBar } from './scan-title-bar.mjs';
import { TITLE_BAR_OUTPUT } from './title-bar-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, hasOrder?: boolean, hasMeta?: boolean }} RenderedFile
 */

/** @param {string} id */
const identifierOf = (id) => `${id.split('-').map((word, index) => (index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)).join('')}Item`;

/** @param {string} id @param {string} name */
const localOf = (id, name) => identifierOf(id).replace(/Item$/, name);

/**
 * @param {RenderedFile} file
 * @returns {{ named: string, order: string }} empty when the file sets no order
 */
const orderOf = (file) => {
  if (file.hasOrder) return { named: `order as ${localOf(file.id, 'Order')}`, order: localOf(file.id, 'Order') };
  if (file.hasMeta) return { named: `meta as ${localOf(file.id, 'Meta')}`, order: `${localOf(file.id, 'Meta')}.order` };
  return { named: '', order: '' };
};

/** @param {RenderedFile} file */
const importOf = (file) => {
  const { named } = orderOf(file);
  return `import ${identifierOf(file.id)}${named ? `, { ${named} }` : ''} from '../${file.path.replace(/\.ts$/, '')}';`;
};

/** @param {RenderedFile} file */
const entryOf = (file) => {
  const { order } = orderOf(file);
  return `  { id: '${file.id}', source: ${identifierOf(file.id)}${order ? `, order: ${order}` : ''} },`;
};

/**
 * @param {RenderedFile[]} files
 * @returns {string} the content of .brock/title-bar.ts
 */
const renderTitleBar = (files) => {
  const imports = files.map(importOf);
  const list = files.length ? ['[', ...files.map(entryOf), ']'].join('\n') : '[]';
  return [
    GENERATED_HEADER,
    `import { titleBarFromFiles } from '${REACT_PACKAGE}';`,
    ...imports,
    '',
    `const appTitleBar = titleBarFromFiles(${list});`,
    '',
    'export { appTitleBar };',
    '',
  ].join('\n');
};

/**
 * @param {string} rootDir the app root
 * @returns {{ path: string, content: string }[]} .brock/title-bar.ts, always
 */
const renderTitleBarFiles = (rootDir) => [{ path: TITLE_BAR_OUTPUT, content: renderTitleBar(scanTitleBar(rootDir).files.filter((file) => file.hasDefault)) }];

export { renderTitleBar, renderTitleBarFiles };
