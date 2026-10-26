/* @layer tooling-scripts @kind logic */
const TOKEN = /\/\/[^\n]*|\/\*|(?:br|r)(#*)"|b?"(?:\\[\s\S]|[^"\\])*"|b?'(?:\\[^'\n]+|[^\\'\n])'|[A-Za-z_]\w*|[\s\S]/y;
const BLOCK_EDGE = /\/\*|\*\//g;

const blockEnd = (text, from) => {
  BLOCK_EDGE.lastIndex = from;
  let depth = 1;
  for (let edge = BLOCK_EDGE.exec(text); edge; edge = BLOCK_EDGE.exec(text)) {
    depth += edge[0] === '/*' ? 1 : -1;
    if (!depth) return BLOCK_EDGE.lastIndex;
  }
  return text.length;
};

const rawEnd = (text, from, hashes) => {
  const close = text.indexOf(`"${hashes}`, from);
  return close < 0 ? text.length : close + 1 + hashes.length;
};

const newlines = (text) => text.match(/\n/g)?.length ?? 0;

const endOf = (text, token, at) => {
  if (token[0] === '/*') return blockEnd(text, at + 2);
  if (token[1] !== undefined) return rawEnd(text, at + token[0].length, token[1]);
  return at + token[0].length;
};

const isTrailing = (text, at) => text.slice(text.lastIndexOf('\n', at - 1) + 1, at).trim() !== '';

/**
 * @param {string} text the Rust source
 * @returns {{ line: number, text: string, block: boolean, trailing: boolean }[]} every comment; strings, raw strings and chars are skipped
 */
const scanRust = (text) => {
  const comments = [];
  let line = 1;
  for (let at = 0; at < text.length;) {
    TOKEN.lastIndex = at;
    const token = TOKEN.exec(text);
    const end = endOf(text, token, at);
    const body = text.slice(at, end);
    if (body.startsWith('//') || body.startsWith('/*')) comments.push({ line, text: body, block: body.startsWith('/*'), trailing: isTrailing(text, at) });
    line += newlines(body);
    at = end;
  }
  return comments;
};

export { scanRust };
