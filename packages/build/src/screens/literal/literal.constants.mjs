/* @layer tooling-scripts @kind constants */
const UNKNOWN = Symbol('unknown');
const OPENERS = '([{';
const CLOSERS = ')]}';
const TERMINATORS = ',;)]}';
const IDENTIFIER = /[A-Za-z_$][\w$]*/y;
const NUMBER = /-?\d+(?:\.\d+)?/y;
const TYPE_SUFFIX = /^(?:as|satisfies)\b/;
const EXPORT_DEFAULT = /export\s+default\s+/;
const WORD_VALUES = new Map([['true', true], ['false', false], ['null', null], ['undefined', undefined]]);
const ESCAPES = new Map([['n', '\n'], ['t', '\t'], ['r', '\r']]);

export { CLOSERS, ESCAPES, EXPORT_DEFAULT, IDENTIFIER, NUMBER, OPENERS, TERMINATORS, TYPE_SUFFIX, UNKNOWN, WORD_VALUES };
