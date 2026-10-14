/* @layer tooling-scripts @kind constants */
const DATA_KINDS = Object.freeze(['data', 'verbatim']);
const VERBATIM_KIND = 'verbatim';
const KIND_HEADER = /^\s*@layer\s+[\w-]+\s+@kind\s+([\w-]+)(?:\s+@source\s+(\S.*?))?\s*$/;
const KIND_HEADER_TEXT = /^(?:#![^\n]*\n)?\s*\/\*\s*@layer\s+[\w-]+\s+@kind\s+([\w-]+)(?:\s+@source\s+(\S.*?))?\s*\*\//;
const DATA_SOURCE = /\.(?:ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const HEADER_BYTES = 512;
const DATA_EXEMPT_RULES = Object.freeze({ 'max-lines': 'off', 'local/one-export-per-file': 'off', 'local/constants-in-constants-file': 'off' });
const NUMBER_OPERATORS = ['+', '-', '*', '/', '%', '**', '<<', '>>', '>>>', '|', '&', '^'];
const UNARY_OPERATORS = ['-', '+', '!', '~'];
const SKIPPED_DIRS = ['node_modules', 'dist', 'release', 'out'];
const GLOB_CHARS = /[*?[\]{}()!+@\\]/g;
const DATA_ONLY_MESSAGE = 'A @kind {{kind}} file holds data only: imports, types, and consts made of literals, arrays, objects, references and constant arithmetic (Object.freeze allowed). This {{what}} is logic: move it to a logic file, or drop @kind {{kind}}.';
const VERBATIM_SOURCE_MESSAGE = 'A @kind verbatim file names the source of its text in the header: /* @layer <layer> @kind verbatim @source <short text> */. Until it does, the prose rules read its strings.';

export {
  DATA_EXEMPT_RULES, DATA_KINDS, DATA_ONLY_MESSAGE, DATA_SOURCE, GLOB_CHARS, HEADER_BYTES, KIND_HEADER, KIND_HEADER_TEXT, NUMBER_OPERATORS, SKIPPED_DIRS, UNARY_OPERATORS,
  VERBATIM_KIND, VERBATIM_SOURCE_MESSAGE,
};
