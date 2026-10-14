/* @layer tooling-scripts @kind logic */
import { GLOB_CHARS, VERBATIM_KIND } from './data-kind.constants.mjs';

/**
 * @param {{ file: string, kind: string, source?: string }[]} entries the data and verbatim files
 * @returns {{ files: string[], why: string }[]} verbatimText entries
 */
const verbatimText = (entries) => entries
  .filter((entry) => entry.kind === VERBATIM_KIND && entry.source)
  .map(({ file, source }) => ({ files: [file.replace(GLOB_CHARS, '\\$&')], why: `@kind verbatim, reproduced from ${source}` }));

export { verbatimText };
