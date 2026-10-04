/* @layer tooling-scripts @kind logic */
import { closingIndex as closingOf } from './closing-index.mjs';
import { stringEnd } from './string-end.mjs';

const valueEnd = (source, at) => (source[at] === '{' ? closingOf(source, at, '{}') : stringEnd(source, at)) + 1;

const readAttribute = (source, at) => {
  const name = /^[A-Za-z_$][\w$:-]*/.exec(source.slice(at, at + 200))?.[0];
  if (!name) return { attribute: null, next: at + 1 };
  const afterName = at + name.length;
  const equals = /^\s*=\s*/.exec(source.slice(afterName, afterName + 50))?.[0];
  if (!equals) return { attribute: { name, start: at, end: afterName, value: null }, next: afterName };
  const end = valueEnd(source, afterName + equals.length);
  return { attribute: { name, start: at, end, value: source.slice(afterName + equals.length, end) }, next: end };
};

const tagClosed = (source, at) => source[at] === '>' || source.startsWith('/>', at);

/**
 * @param {string} source
 * @param {number} nameEnd the index right after `<Element`
 * @returns {{ name: string, start: number, end: number, value: string | null }[]}
 */
const jsxAttributes = (source, nameEnd) => {
  const attributes = [];
  let at = source[nameEnd] === '<' ? closingOf(source, nameEnd, '<>') + 1 : nameEnd;
  while (at < source.length && !tagClosed(source, at)) {
    if (source[at] === '{') {
      at = closingOf(source, at, '{}') + 1;
      continue;
    }
    const { attribute, next } = readAttribute(source, at);
    if (attribute) attributes.push(attribute);
    at = next;
  }
  return attributes;
};

export { jsxAttributes };
