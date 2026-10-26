/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

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
  const root = realpathSync.native(mkdtempSync(join(tmpdir(), 'brock-repo-')));
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

const BUILD_PACKAGE = resolve(import.meta.dirname, '..');

/**
 * @param {string} root
 * @returns {string} the folder, with this brock-build linked in
 */
const linkBuildPackage = (root) => {
  mkdirSync(join(root, 'node_modules', '@drizztdourden08'), { recursive: true });
  symlinkSync(BUILD_PACKAGE, join(root, 'node_modules', '@drizztdourden08', 'brock-build'), 'junction');
  return root;
};

export { tempRepo, brockWorkspace, removeTempRepos, linkBuildPackage, BUILD_PACKAGE };
