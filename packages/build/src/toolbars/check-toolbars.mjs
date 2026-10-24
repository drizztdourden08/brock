/* @layer tooling-scripts @kind logic */
import { scanToolbars } from './scan-toolbars.mjs';

/** @param {import('./scan-toolbars.mjs').ToolbarFile} file @returns {string[]} */
const fileFindings = (file) => [
  ...(file.hasDefault ? [] : [`${file.path}: no default export; a toolbar file default-exports defineToolbar({ id, label, defaultSide, render })`]),
  ...(file.literalId !== null && file.literalId !== file.id ? [`${file.path}: defineToolbar names id "${file.literalId}", but the file name makes it "${file.id}"; make them the same`] : []),
];

/**
 * @param {string} rootDir the app root
 * @returns {string[]} what brock structure reports about src/toolbars
 */
const checkToolbars = (rootDir) => {
  const { files, findings } = scanToolbars(rootDir);
  return [...findings, ...files.flatMap(fileFindings)];
};

export { checkToolbars };
