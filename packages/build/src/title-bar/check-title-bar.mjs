/* @layer tooling-scripts @kind logic */
import { scanTitleBar } from './scan-title-bar.mjs';
import { RESERVED_IDS } from './title-bar-conventions.constants.mjs';

/** @param {import('./scan-title-bar.mjs').TitleBarFile} file @returns {string[]} */
const fileFindings = (file) => [
  ...(file.hasDefault ? [] : [`${file.path}: no default export; a title bar item file default-exports defineTitleBarItem(...) or a hook`]),
  ...(RESERVED_IDS.includes(file.id) ? [`${file.path}: "${file.id}" is a standard Brock title bar item id; pick another`] : []),
];

/**
 * @param {string} rootDir the app root
 * @returns {string[]} what brock structure reports about src/title-bar
 */
const checkTitleBar = (rootDir) => {
  const { files, findings } = scanTitleBar(rootDir);
  return [...findings, ...files.flatMap(fileFindings)];
};

export { checkTitleBar };
