/* @layer tooling-scripts @kind logic */
import { join, relative } from 'node:path';
import { ensurePnpmPackageManager } from '../../src/release/pnpm-package-manager.mjs';
import { findWorkspaceRoot } from '../../src/workspace.mjs';

const workspace = ({ rootDir }) => {
  const repoDir = findWorkspaceRoot(rootDir) ?? rootDir;
  const label = relative(rootDir, join(repoDir, 'package.json')).replace(/\\/g, '/');
  const { status, value } = ensurePnpmPackageManager(repoDir);
  if (status === 'added') return { touched: [label] };
  if (status === 'unknown') return { touched: [], todos: [{ file: label, line: null, message: 'Add "packageManager": "pnpm@<version>" with the version pnpm --version prints; the managed workflows install that pnpm.' }] };
  if (status === 'other') return { touched: [], todos: [{ file: label, line: null, message: `packageManager names ${value}; the managed workflows install pnpm from it, so it must be pnpm@<version>.` }] };
  return { touched: [] };
};

const migration = Object.freeze({
  id: 'pnpm-package-manager',
  summary: 'The managed workflows no longer pin pnpm 10 in pnpm/action-setup, which failed next to a packageManager field; the pnpm version comes from packageManager in the root package.json alone. The migration adds it, pnpm@<the version in use>, where it is missing.',
  workspace,
});

export { migration };
