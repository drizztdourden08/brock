/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { walkFiles } from '../walk-files.mjs';

const mtimeOf = (file) => (existsSync(file) ? statSync(file).mtimeMs : 0);

const newestOfKind = (dir, extensions, skipDirs) => {
  let newest = 0;
  walkFiles(dir, (file, name) => {
    if (extensions.has(extname(name))) newest = Math.max(newest, statSync(file).mtimeMs);
  }, skipDirs);
  return newest;
};

const outputsOf = (root, wasm) => {
  const dir = join(root, wasm.output);
  if (!existsSync(dir)) return [];
  const wanted = new Set(wasm.outputExtensions);
  return readdirSync(dir).filter((name) => wanted.has(extname(name))).map((name) => join(dir, name));
};

/**
 * @param {string} root the checkout
 * @param {Record<string, any>} wasm the wasm options
 * @returns {string | null} why the core needs a build, or null when current
 */
const wasmStaleReason = (root, wasm) => {
  const outputs = outputsOf(root, wasm);
  if (outputs.length === 0) return 'the core output is missing';
  const builtAt = Math.min(...outputs.map(mtimeOf));
  const extensions = new Set(wasm.sourceExtensions);
  const skipDirs = new Set(wasm.skipDirs);
  const sourceAt = Math.max(
    ...wasm.sourceDirs.map((dir) => newestOfKind(join(root, dir), extensions, skipDirs)),
    mtimeOf(join(root, wasm.buildScript)),
  );
  return sourceAt > builtAt ? 'sources changed since the last build' : null;
};

export { wasmStaleReason };
