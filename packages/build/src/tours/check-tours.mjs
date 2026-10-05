/* @layer tooling-scripts @kind logic */
import { scanTours } from './scan-tours.mjs';

/** @param {import('./scan-tours.mjs').TourFile} file @returns {string[]} */
const fileFindings = (file) => [
  ...(file.hasDefault ? [] : [`${file.path}: no default export; a tour file default-exports defineTour({ id, title, steps })`]),
  ...(file.literalId !== null && file.literalId !== file.id ? [`${file.path}: defineTour names id "${file.literalId}", but the file name makes it "${file.id}"; make them the same`] : []),
];

/**
 * @param {string} rootDir the app root
 * @returns {string[]} what brock structure reports about src/tours
 */
const checkTours = (rootDir) => {
  const { files, findings } = scanTours(rootDir);
  return [...findings, ...files.flatMap(fileFindings)];
};

export { checkTours };
