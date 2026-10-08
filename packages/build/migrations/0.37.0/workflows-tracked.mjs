/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { keepGithubTracked } from '../../src/release/keep-github-tracked.mjs';
import { findWorkspaceRoot } from '../../src/workspace.mjs';

const workspace = ({ rootDir }) => {
  const repoDir = findWorkspaceRoot(rootDir) ?? rootDir;
  const file = join(repoDir, '.gitignore');
  if (!existsSync(file)) return { touched: [] };
  const kept = keepGithubTracked(readFileSync(file, 'utf8'));
  if (kept === null) return { touched: [] };
  writeFileSync(file, kept, 'utf8');
  return { touched: [relative(rootDir, file).replace(/\\/g, '/')] };
};

const migration = Object.freeze({
  id: 'workflows-tracked',
  summary: "brock sync writes the workflows under .github/workflows, and the .*/ line of the standard .gitignore hid them, so a commit left them out. The repo's .gitignore gets !.github/ right after the rule that hides it; brock sync keeps it there, and brock check fails while git ignores a managed workflow.",
  workspace,
});

export { migration };
