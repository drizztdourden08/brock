/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE } from '../screens/screen-conventions.constants.mjs';
import { scanToolbars } from './scan-toolbars.mjs';
import { TOOLBARS_OUTPUT } from './toolbar-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string }} RenderedToolbar
 */

/** @param {string} id */
const identifierOf = (id) => `${id.split('-').map((word, index) => (index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)).join('')}Toolbar`;

/** @param {RenderedToolbar} file */
const sourceOf = (file) => `../${file.path.replace(/\.tsx$/, '')}`;

/**
 * @param {RenderedToolbar[]} files
 * @returns {string} the content of .brock/toolbars.ts
 */
const renderToolbars = (files) => {
  const list = files.length ? ['[', ...files.map((file) => `  ${identifierOf(file.id)},`), ']'].join('\n') : '[]';
  return [
    GENERATED_HEADER,
    `import type { ToolbarDef } from '${REACT_PACKAGE}';`,
    ...files.map((file) => `import ${identifierOf(file.id)} from '${sourceOf(file)}';`),
    '',
    `const appToolbars: ToolbarDef[] = ${list};`,
    '',
    'export { appToolbars };',
    '',
  ].join('\n');
};

/**
 * @param {string} rootDir the app root
 * @returns {{ path: string, content: string }[]} .brock/toolbars.ts, always
 */
const renderToolbarsFiles = (rootDir) => [{ path: TOOLBARS_OUTPUT, content: renderToolbars(scanToolbars(rootDir).files.filter((file) => file.hasDefault)) }];

export { renderToolbars, renderToolbarsFiles };
