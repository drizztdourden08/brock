/* @layer tooling-scripts @kind constants */
const NAME_START = /[\p{ID_Start}$_]/u;
const NAME_PART = /[\p{ID_Continue}$‌‍]/u;
const NUMBER_PART = /[\w.]/;
const DIGIT = /\d/;
const SPACE = /\s/;
const ENDS_EXPRESSION = Object.freeze(new Set([')', ']', '}']));
const BEFORE_EXPRESSION = Object.freeze(new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await', 'extends']));

export { BEFORE_EXPRESSION, DIGIT, ENDS_EXPRESSION, NAME_PART, NAME_START, NUMBER_PART, SPACE };
