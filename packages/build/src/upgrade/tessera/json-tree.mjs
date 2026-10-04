/* @layer tooling-scripts @kind logic */
const SPACE = /\s/;
const SCALAR_END = /[\s,\]}]/;

const reader = (text) => {
  const state = { at: 0 };
  const skip = () => {
    while (state.at < text.length && SPACE.test(text[state.at])) state.at += 1;
  };
  const string = () => {
    const start = state.at;
    state.at += 1;
    while (text[state.at] !== '"') state.at += text[state.at] === '\\' ? 2 : 1;
    state.at += 1;
    return { start, end: state.at, text: JSON.parse(text.slice(start, state.at)) };
  };
  return { state, skip, string, char: () => text[state.at] };
};

const parseScalar = (io, text) => {
  const start = io.state.at;
  if (io.char() === '"') return { kind: 'scalar', start, end: io.string().end };
  while (io.state.at < text.length && !SCALAR_END.test(text[io.state.at])) io.state.at += 1;
  return { kind: 'scalar', start, end: io.state.at };
};

const parseList = (io, close, item) => {
  const start = io.state.at;
  const entries = [];
  io.state.at += 1;
  io.skip();
  while (io.char() !== close) {
    entries.push(item());
    io.skip();
    if (io.char() === ',') io.state.at += 1;
    io.skip();
  }
  io.state.at += 1;
  return { start, end: io.state.at, entries };
};

const parseValue = (io, text) => {
  io.skip();
  if (io.char() === '[') return { kind: 'array', ...parseList(io, ']', () => parseValue(io, text)) };
  if (io.char() !== '{') return parseScalar(io, text);
  const member = () => {
    const key = io.string();
    io.skip();
    io.state.at += 1;
    return { key: key.text, keyStart: key.start, keyEnd: key.end, value: parseValue(io, text) };
  };
  const { start, end, entries } = parseList(io, '}', member);
  return { kind: 'object', start, end, members: entries };
};

/**
 * @param {string} text JSON
 * @returns {Record<string, any> | null} offsets of every key and value; null if not JSON
 */
const parseJsonTree = (text) => {
  try {
    JSON.parse(text);
  } catch {
    return null;
  }
  return parseValue(reader(text), text);
};

/**
 * @param {Record<string, any>} root
 * @param {readonly string[]} path
 * @returns {{ node: Record<string, any>, member: Record<string, any> | null, parent: Record<string, any> | null } | null}
 */
const findJsonPath = (root, path) => {
  let found = { node: root, member: null, parent: null };
  for (const key of path) {
    if (found.node.kind !== 'object') return null;
    const member = found.node.members.find((candidate) => candidate.key === key);
    if (!member) return null;
    found = { node: member.value, member, parent: found.node };
  }
  return found;
};

export { findJsonPath, parseJsonTree };
