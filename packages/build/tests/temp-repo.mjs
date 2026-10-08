/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const roots = [];

const writeAt = (root, path, content) => {
  const file = join(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};

/**
 * @param {Record<string, string>} files
 * @returns {string} a temp folder holding them
 */
const tempRepo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-repo-'));
  roots.push(root);
  Object.entries(files).forEach(([path, content]) => writeAt(root, path, content));
  return root;
};

/**
 * @param {Record<string, string>} [files]
 * @returns {string} a Brock workspace with apps/desktop
 */
const brockWorkspace = (files = {}) => tempRepo({
  '.git/HEAD': 'ref: refs/heads/main\n',
  'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n  - 'packages/*'\n",
  'brock.workspace.mjs': 'export default {};\n',
  'apps/desktop/brock.config.ts': "export default { product: { id: 'atlas', name: 'Atlas' } };\n",
  'apps/desktop/package.json': '{ "name": "@atlas/desktop", "version": "0.2.0" }\n',
  ...files,
});

const removeTempRepos = () => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
};

export { tempRepo, brockWorkspace, removeTempRepos };
