/* @layer tooling-scripts @kind logic */
import { BEFORE_EXPRESSION, DIGIT, ENDS_EXPRESSION, NAME_PART, NAME_START, NUMBER_PART, SPACE } from './js-tokens.constants.mjs';

const push = (state, token, end) => {
  state.tokens.push(token);
  state.at = end;
};

const skipWhile = (source, from, pattern) => {
  let end = from;
  while (end < source.length && pattern.test(source[end])) end += 1;
  return end;
};

const endOf = (source, marker, from) => {
  const found = source.indexOf(marker, from);
  return found === -1 ? source.length : found + marker.length;
};

const readString = (state) => {
  const { source, at } = state;
  let end = at + 1;
  while (end < source.length && source[end] !== source[at] && source[end] !== '\n') end += source[end] === '\\' ? 2 : 1;
  push(state, { type: 'string', value: source.slice(at + 1, end) }, end + 1);
};

const readTemplateText = (state, from) => {
  const { source } = state;
  for (let end = from; end < source.length; end += source[end] === '\\' ? 2 : 1) {
    if (source[end] === '`') return push(state, { type: 'template' }, end + 1);
    if (source[end] === '$' && source[end + 1] === '{') {
      state.braces.push('template');
      return push(state, { type: 'punct', value: '${' }, end + 2);
    }
  }
  state.at = source.length;
};

const readBrace = (state) => {
  const char = state.source[state.at];
  if (char === '{') state.braces.push('brace');
  else if (state.braces.pop() === 'template') return readTemplateText(state, state.at + 1);
  push(state, { type: 'punct', value: char }, state.at + 1);
};

const regexAllowed = (last) => {
  if (!last) return true;
  if (last.type === 'name') return BEFORE_EXPRESSION.has(last.value);
  return last.type === 'punct' && !ENDS_EXPRESSION.has(last.value);
};

const regexBodyEnd = (source, from) => {
  let inClass = false;
  for (let end = from; end < source.length; end += 1) {
    const char = source[end];
    if (char === '\\') end += 1;
    else if (char === '\n' || (char === '/' && !inClass)) return end;
    else if (char === '[' || char === ']') inClass = char === '[';
  }
  return source.length;
};

const readSlash = (state) => {
  const { source, at } = state;
  if (source[at + 1] === '/') state.at = endOf(source, '\n', at);
  else if (source[at + 1] === '*') state.at = endOf(source, '*/', at + 2);
  else if (regexAllowed(state.tokens.at(-1))) push(state, { type: 'regex' }, skipWhile(source, regexBodyEnd(source, at + 1) + 1, NAME_PART));
  else push(state, { type: 'punct', value: '/' }, at + 1);
};

const readName = (state) => {
  const end = skipWhile(state.source, state.at + 1, NAME_PART);
  push(state, { type: 'name', value: state.source.slice(state.at, end) }, end);
};

const readNumber = (state) => push(state, { type: 'number' }, skipWhile(state.source, state.at + 1, NUMBER_PART));

const readPunct = (state) => push(state, { type: 'punct', value: state.source[state.at] }, state.at + 1);

const startsNumber = (state, char) => DIGIT.test(char) || (char === '.' && DIGIT.test(state.source[state.at + 1] ?? ''));

const readerFor = (state, char) => {
  if (char === '"' || char === '\'') return readString;
  if (char === '`') return (s) => readTemplateText(s, s.at + 1);
  if (char === '/') return readSlash;
  if (char === '{' || char === '}') return readBrace;
  if (NAME_START.test(char)) return readName;
  return startsNumber(state, char) ? readNumber : readPunct;
};

/**
 * @param {string} source JavaScript source, such as a bundled file
 * @returns {{ type: 'name' | 'string' | 'punct' | 'number' | 'regex' | 'template', value?: string }[]} its tokens, comments left out
 */
const jsTokens = (source) => {
  const state = { source, at: source.startsWith('#!') ? endOf(source, '\n', 0) : 0, tokens: [], braces: [] };
  while (state.at < source.length) {
    const char = source[state.at];
    if (SPACE.test(char)) state.at += 1;
    else readerFor(state, char)(state);
  }
  return state.tokens;
};

export { jsTokens };
