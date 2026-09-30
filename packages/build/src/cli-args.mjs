/* @layer tooling-scripts @kind logic */
import { parseArgs } from 'node:util';

const OPTIONS = {
  root: { type: 'string' },
  scope: { type: 'string' },
  local: { type: 'string' },
  force: { type: 'boolean', default: false },
  check: { type: 'boolean', default: false },
  full: { type: 'boolean', default: false },
  channel: { type: 'string' },
  from: { type: 'string' },
  to: { type: 'string' },
  report: { type: 'string' },
  help: { type: 'boolean', short: 'h', default: false },
  version: { type: 'boolean', short: 'v', default: false },
};

const splitAtDoubleDash = (argv) => {
  const at = argv.indexOf('--');
  return at === -1 ? { own: argv, passthrough: [] } : { own: argv.slice(0, at), passthrough: argv.slice(at + 1) };
};

const rawOf = (token) => (token.value === undefined ? token.rawName : `${token.rawName}=${token.value}`);

/**
 * @param {string[]} argv
 * @returns {{ values: Record<string, unknown>, positionals: string[], passthrough: string[] }}
 */
const parseCli = (argv) => {
  const { own, passthrough } = splitAtDoubleDash(argv);
  const { values, positionals, tokens } = parseArgs({ args: own, options: OPTIONS, allowPositionals: true, strict: false, tokens: true });
  const unknown = tokens.filter((token) => token.kind === 'option' && !(token.name in OPTIONS)).map(rawOf);
  for (const token of tokens) if (token.kind === 'option' && !(token.name in OPTIONS)) delete values[token.name];
  return { values, positionals, passthrough: [...unknown, ...passthrough] };
};

export { parseCli };
