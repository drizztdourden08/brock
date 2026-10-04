/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE } from '../screens/screen-conventions.constants.mjs';
import { scanTitleBar } from './scan-title-bar.mjs';
import { TITLE_BAR_OUTPUT } from './title-bar-conventions.constants.mjs';

/** @param {string} id */
const identifierOf = (id) => `${id.split('-').map((word, index) => (index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)).join('')}Item`;

/**
 * @param {{ id: string, path: string }[]} files
 * @returns {string} the content of .brock/title-bar.ts
 */
const renderTitleBar = (files) => {
  const imports = files.map((file) => `import ${identifierOf(file.id)} from '../${file.path.replace(/\.ts$/, '')}';`);
  const list = files.length ? ['[', ...files.map((file) => `  { id: '${file.id}', source: ${identifierOf(file.id)} },`), ']'].join('\n') : '[]';
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
