/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const WORKSPACE_NAME = /\bname:\s*(['"])([^'"]+)\1/;

const scoped = (name) => (name.startsWith('@') ? name.split('/')[0] : `@${name.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}`);

const readIf = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');

/**
 * @param {string} repoRoot
 * @returns {string} such as @acme
 */
const repoScope = (repoRoot) => {
  const workspaceName = WORKSPACE_NAME.exec(readIf(join(repoRoot, 'brock.workspace.mjs')))?.[2];
  if (workspaceName) return scoped(workspaceName);
  const scopeFile = readIf(join(repoRoot, 'brock.scope')).trim();
  if (scopeFile) return scoped(scopeFile);
  return scoped(JSON.parse(readIf(join(repoRoot, 'package.json')) || '{}').name ?? 'app');
};

export { repoScope };
