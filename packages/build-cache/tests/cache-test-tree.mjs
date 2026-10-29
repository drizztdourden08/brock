/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/**
 * @param {string} prefix the temp folder name prefix
 * @returns {{ tempDir: () => string, put: (root: string, files: Record<string, string>) => void, cleanup: () => void }}
 */
const cacheTestTree = (prefix) => {
  const made = [];
  return {
    tempDir: () => {
      const dir = mkdtempSync(join(tmpdir(), prefix));
      made.push(dir);
      return dir;
    },
    put: (root, files) => {
      for (const [path, content] of Object.entries(files)) {
        mkdirSync(dirname(join(root, path)), { recursive: true });
        writeFileSync(join(root, path), content);
      }
    },
    cleanup: () => {
      for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
    },
  };
};

/**
 * @param {string} name a package name
 * @param {Record<string, string>} [extra] more files, relative to the package
 * @returns {Record<string, string>} a small source package: two exports that share one module
 */
const sourcePackage = (name, extra = {}) => ({
  'package.json': JSON.stringify({ name, version: '1.2.3', type: 'module', exports: { '.': './src/index.ts', './sub': './src/sub.ts', './package.json': './package.json' }, dependencies: { 'left-pad': '^1.0.0' } }),
  'src/state.ts': 'export const state: { count: number } = { count: 0 };\n',
  'src/index.ts': "import pad from 'left-pad';\nimport { state } from './state';\nexport const bump = (): string => { state.count += 1; return pad(state.count, 2); };\n",
  'src/sub.ts': "export { state } from './state';\n",
  ...extra,
});

export { cacheTestTree, sourcePackage };
