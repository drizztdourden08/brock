/* @layer tooling-scripts @kind logic */
const quoteChars = '"\'`';

const stringEnd = (source, at) => {
  for (let i = at + 1; i < source.length; i += 1) {
    if (source[i] === '\\') i += 1;
    else if (source[i] === source[at]) return i;
  }
  return source.length;
};

const closingOf = (source, at, [open, close]) => {
  let depth = 0;
  for (let i = at; i < source.length; i += 1) {
    if (quoteChars.includes(source[i])) i = stringEnd(source, i);
    else if (source[i] === open) depth += 1;
    else if (source[i] === close) depth -= 1;
    if (depth === 0) return i;
  }
  return source.length;
};

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
