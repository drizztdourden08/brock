/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { declaredExternalsPlugin, packageNameOf } from '../src/declared-externals.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-declared-');

afterEach(cleanup);

const run = (rootDir, extraImports, imports) => {
  const errors = [];
  const plugin = declaredExternalsPlugin(rootDir, new Map(), extraImports);
  plugin.generateBundle.call({ error: (message) => errors.push(message) }, {}, { 'main.js': { type: 'chunk', imports } });
  return errors;
};

describe('declared externals with the build cache', () => {
  it('reads a placed file path or a file URL as no package', () => {
    expect(packageNameOf('X:/app/node_modules/.build-cache/node_modules/@s/a/main.js')).toBeNull();
    expect(packageNameOf('file:///X:/app/main.js')).toBeNull();
    expect(packageNameOf('@s/a/main')).toBe('@s/a');
  });

  it('asks the app to declare what the served packages load at runtime', () => {
    const root = tempDir();
    put(root, 'package.json', JSON.stringify({ dependencies: { 'left-pad': '1.0.0' } }));
    expect(run(root, () => ['left-pad'], [join(root, 'x.js')])).toEqual([]);
    const [error] = run(root, () => ['right-pad'], []);
    expect(error).toContain('"right-pad"');
  });
});
