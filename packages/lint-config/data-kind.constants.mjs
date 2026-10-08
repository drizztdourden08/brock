/* @layer tooling-scripts @kind constants */
const DATA_HEADER = /^\s*@layer\s+[\w-]+\s+@kind\s+data\s*$/;
const DATA_HEADER_TEXT = /^(?:#![^\n]*\n)?\s*\/\*\s*@layer\s+[\w-]+\s+@kind\s+data\s*\*\//;
const DATA_SOURCE = /\.(?:ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const HEADER_BYTES = 512;
const DATA_EXEMPT_RULES = Object.freeze({ 'max-lines': 'off', 'local/one-export-per-file': 'off', 'local/constants-in-constants-file': 'off' });
const NUMBER_OPERATORS = ['+', '-', '*', '/', '%', '**', '<<', '>>', '>>>', '|', '&', '^'];
const UNARY_OPERATORS = ['-', '+', '!', '~'];
const SKIPPED_DIRS = ['node_modules', 'dist', 'release', 'out'];
const GLOB_CHARS = /[*?[\]{}()!+@\\]/g;
const DATA_ONLY_MESSAGE = 'A @kind data file holds data only: imports, types, and consts made of literals, arrays, objects, references and constant arithmetic (Object.freeze allowed). This {{what}} is logic: move it to a logic file, or drop @kind data.';

export {
  DATA_EXEMPT_RULES, DATA_HEADER, DATA_HEADER_TEXT, DATA_ONLY_MESSAGE, DATA_SOURCE, GLOB_CHARS, HEADER_BYTES, NUMBER_OPERATORS, SKIPPED_DIRS, UNARY_OPERATORS,
};
