/* @layer tooling-scripts @kind logic */
import { gitignoreChain, insertLines } from '../../src/upgrade/gitignore-chain.mjs';

const DOT_FOLDERS = '.*/';
const KEEP = ['!.brock/', '.brock/profile-config.json'];

const workspace = ({ rootDir }) => {
  const chain = gitignoreChain(rootDir);
  const has = (line) => chain.some((ignore) => ignore.lines.some((present) => present.trim() === line));
  if (has(KEEP[0])) return {};
  const owner = chain.find((ignore) => ignore.lines.some((line) => line.trim() === DOT_FOLDERS));
  if (!owner) return {};
  const anchor = owner.lines.findIndex((line) => line.trim() === DOT_FOLDERS);
  let after = anchor;
  while (owner.lines[after + 1]?.trim().startsWith('!') || owner.lines[after + 1]?.trim().startsWith('.vscode/')) after += 1;
  insertLines(owner, after, KEEP.filter((line) => !has(line)));
  return { touched: [owner.label] };
};

const migration = Object.freeze({
  id: 'brock-dir-tracked',
  summary: 'The generated .brock/*.ts files are committed, so a fresh checkout type-checks and brock check can see drift. A .gitignore whose .*/ line hid .brock gets !.brock/ (and .brock/profile-config.json, which stays ignored).',
  workspace,
});

export { migration };
