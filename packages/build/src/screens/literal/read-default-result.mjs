/* @layer tooling-scripts @kind logic */
import { EXPORT_DEFAULT, IDENTIFIER, UNKNOWN } from './literal.constants.mjs';
import { readExport } from './read-export.mjs';
import { readValue } from './read-value.mjs';

const RESULT_ARRAY = /=>\s*\(?\s*(?=\[)|\breturn\s+\(?\s*(?=\[)/;
const RESULT_NAME = /(?:=>|\breturn)\s*([A-Za-z_$][\w$]*)\s*;?\s*(?:\}|$)/m;

const bodyStart = (src) => {
  const match = EXPORT_DEFAULT.exec(src);
  if (!match) return -1;
  const after = match.index + match[0].length;
  IDENTIFIER.lastIndex = after;
  const name = IDENTIFIER.exec(src)?.[0];
  const declared = name ? new RegExp(`\\b(?:const|let|var|function)\\s+${name}\\b`).exec(src) : null;
  return declared ? declared.index : after;
};

const readDefaultResult = (src) => {
  const start = bodyStart(src);
  if (start === -1) return UNKNOWN;
  const body = src.slice(start);
  const found = RESULT_ARRAY.exec(body);
  if (found) return readValue(src, start + found.index + found[0].length, (ref) => readExport(src, ref)).value;
  const named = RESULT_NAME.exec(body)?.[1];
  return named ? readExport(src, named) : UNKNOWN;
};

export { readDefaultResult };
