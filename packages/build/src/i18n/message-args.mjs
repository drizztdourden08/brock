/* @layer tooling-scripts @kind logic */
const FORMATS = new Set(['number', 'date', 'time', 'list']);
const BRANCHED = new Set(['plural', 'selectordinal', 'select']);
const TAG = /<(\/?)([A-Za-z][\w.-]*)\s*>/y;

/**
 * @typedef {{ kind: string, options: string[] }} ArgUse
 * @typedef {{ args: Map<string, ArgUse>, tags: Set<string> }} MessageArgs
 */

const fail = (st, text) => {
  throw new Error(`${text} at ${st.i}`);
};

const note = (out, name, kind, options = []) => {
  const known = out.args.get(name);
  if (!known || known.kind === 'arg') out.args.set(name, { kind, options });
  else if (kind === known.kind) known.options.push(...options);
};

const skipQuote = (st) => {
  const next = st.src[st.i + 1];
  if (next === "'") st.i += 2;
  else if (next === '{' || next === '}') st.i = (st.src.indexOf("'", st.i + 2) + 1 || st.src.length);
  else st.i += 1;
};

const readTag = (st, out) => {
  TAG.lastIndex = st.i;
  const match = TAG.exec(st.src);
  if (!match) st.i += 1;
  else {
    st.i = TAG.lastIndex;
    if (match[1] === '') out.tags.add(match[2]);
  }
};

const readUntil = (st, stops) => {
  const from = st.i;
  while (st.i < st.src.length && !stops.includes(st.src[st.i])) st.i += 1;
  if (st.i >= st.src.length) fail(st, 'unclosed argument');
  return st.src.slice(from, st.i).trim();
};

const skipSpace = (st) => {
  while (/\s/.test(st.src[st.i] ?? '')) st.i += 1;
};

const readBody = (st, out, nested) => {
  while (st.i < st.src.length) {
    const ch = st.src[st.i];
    if (ch === '}') return nested ? undefined : fail(st, 'unmatched }');
    if (ch === "'") skipQuote(st);
    else if (ch === '<') readTag(st, out);
    else if (ch === '{') {
      st.i += 1;
      readArgument(st, out);
    } else st.i += 1;
  }
  return nested ? fail(st, 'unclosed {') : undefined;
};

const readCase = (st, out) => {
  const selector = readUntil(st, ['{', '}']);
  if (st.src[st.i] !== '{') fail(st, 'a branch needs { }');
  st.i += 1;
  readBody(st, out, true);
  st.i += 1;
  return selector;
};

const readBranches = (st, out) => {
  const selectors = [];
  for (skipSpace(st); st.src[st.i] !== '}'; skipSpace(st)) {
    const selector = readCase(st, out);
    if (!selector.startsWith('offset:')) selectors.push(selector);
  }
  return selectors;
};

const readArgument = (st, out) => {
  const name = readUntil(st, [',', '}']);
  if (st.src[st.i] === '}') note(out, name, 'arg');
  else {
    st.i += 1;
    const type = readUntil(st, [',', '}']);
    if (st.src[st.i] === ',') st.i += 1;
    if (BRANCHED.has(type)) {
      const selectors = readBranches(st, out);
      note(out, name, type === 'select' ? 'select' : 'number', type === 'select' ? selectors.filter((s) => s !== 'other') : []);
    } else if (FORMATS.has(type)) {
      readUntil(st, ['}']);
      note(out, name, type);
    } else fail(st, `unknown argument type "${type}"`);
  }
  st.i += 1;
};

/**
 * @param {string} source an ICU message
 * @returns {MessageArgs} each argument by name with its kind, and the tag names; throws on a message that does not parse
 */
const messageArgs = (source) => {
  const out = { args: new Map(), tags: new Set() };
  readBody({ src: source, i: 0 }, out, false);
  return out;
};

export { messageArgs };
