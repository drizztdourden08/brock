/* @layer tooling-scripts @kind logic */
const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/** @param {string} text */
const quoted = (text) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** @param {import('./message-args.mjs').ArgUse} use @returns {string} */
const typeOf = ({ kind, options }) => {
  if (kind === 'number') return 'number';
  if (kind === 'date' || kind === 'time') return 'Date | number';
  if (kind === 'list') return 'readonly string[]';
  if (kind === 'select' && options.length) return `${[...new Set(options)].map(quoted).join(' | ')} | (string & {})`;
  return kind === 'select' ? 'string' : 'string | number';
};

/**
 * @param {import('./message-args.mjs').MessageArgs} found
 * @returns {string} the values type of one message
 */
const renderValueType = ({ args }) => {
  if (!args.size) return 'Record<never, never>';
  const members = [...args].map(([name, use]) => `${IDENTIFIER.test(name) ? name : quoted(name)}: ${typeOf(use)}`);
  return `{ ${members.join('; ')} }`;
};

export { quoted, renderValueType };
