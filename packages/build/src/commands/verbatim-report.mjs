/* @layer tooling-scripts @kind logic */
import { dataFiles } from '@drizztdourden08/brock-lint-config/data-files';

const sourceNote = (source) => (source ? `source: ${source}` : 'no @source in the header: lint fails and the prose rules still read it');

/**
 * @param {string} rootDir
 * @param {string} label
 * @returns {string[]} the verbatim files and their sources
 */
const verbatimReport = (rootDir, label) => {
  const verbatim = dataFiles(rootDir).filter((entry) => entry.kind === 'verbatim');
  if (!verbatim.length) return [];
  return [
    `${label}: ${verbatim.length} @kind verbatim file(s); the dash, punctuation and prose rules skip their string values:`,
    ...verbatim.map(({ file, source }) => `  ${file}  ${sourceNote(source)}`),
  ];
};

export { verbatimReport };
