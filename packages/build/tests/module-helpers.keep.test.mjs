/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { loadBuilderConfig } from '../src/builder-config.mjs';
import { helperViteConfig } from '../src/helper-scripts/helper-vite-config.mjs';
import { helperEntriesToBundle } from '../src/helper-scripts/helper-entries-to-bundle.mjs';
import { packageForModule } from '../src/modules/registry.mjs';

const { tempDir, put, cleanup } = tempTree('brock-module-helpers-');
afterEach(cleanup);

const PRODUCT = { id: 'demo-app', appId: 'com.example.demo', name: 'Demo', author: { name: 'Someone' }, icons: {}, protocols: [], fileAssociations: [] };
const PACKAGE = '@acme/brock-demo';

const fixtureApp = (moduleOptions) => {
  const root = tempDir();
  const config = { product: { ...PRODUCT, ...(moduleOptions ? { moduleOptions } : {}) }, modules: ['demo'] };
  put(root, 'package.json', JSON.stringify({ name: 'fixture-app', type: 'module', dependencies: { [PACKAGE]: '1.0.0' } }));
  put(root, 'brock.config.ts', `export default ${JSON.stringify(config)};\n`);
  put(root, `node_modules/${PACKAGE}/package.json`, JSON.stringify({ name: PACKAGE, version: '1.0.0', brock: { id: 'demo', helpers: { 'demo-tool': './src/helper/main.ts' } } }));
  put(root, `node_modules/${PACKAGE}/src/helper/main.ts`, 'export {};\n');
  return { root, config };
};

const shippedFilters = (built) => (built.extraResources ?? []).filter(({ to }) => to === 'helpers').flatMap(({ filter }) => filter);

describe('module helpers', { tags: ['critical'] }, () => {
  it('K1 plans a module helper with an absolute entry for dev and build alike', () => {
    const { root, config } = fixtureApp();
    const planned = helperEntriesToBundle(root, config);
    expect(planned.map(({ name, packaged }) => ({ name, packaged }))).toEqual([{ name: 'demo-tool', packaged: false }]);
    expect(planned[0].entry.replace(/\\/g, '/')).toMatch(/node_modules\/@acme\/brock-demo\/src\/helper\/main\.ts$/);
  });

  it('K1 refuses two helpers of one name', () => {
    const { root, config } = fixtureApp();
    put(root, 'src/helper/own.ts', 'export {};\n');
    expect(() => helperEntriesToBundle(root, { ...config, helpers: { 'demo-tool': 'src/helper/own.ts' } })).toThrow('declared twice');
  });

  it('K1 leaves the helper out of packaged resources and the fuse unless packaged is true', async () => {
    for (const options of [undefined, {}, { demo: {} }, { demo: { packaged: false } }]) {
      const built = await loadBuilderConfig(fixtureApp(options).root);
      expect(shippedFilters(built)).toEqual([]);
      expect(built.electronFuses.runAsNode).toBe(false);
    }
  });

  it('K1 ships the helper and turns on the fuse when packaged is true', async () => {
    const built = await loadBuilderConfig(fixtureApp({ demo: { packaged: true } }).root);
    expect(shippedFilters(built)).toEqual(['demo-tool.mjs']);
    expect(built.electronFuses.runAsNode).toBe(true);
  });

  it('K1 defines the product id in every helper bundle', () => {
    const { root } = fixtureApp();
    const bundle = helperViteConfig(root, undefined, { name: 'demo-tool', entry: join(root, 'main.ts') }, 'demo-app');
    expect(bundle.define['process.env.BROCK_HELPER_APP']).toBe('"demo-app"');
  });

  it('K1 lists the mcp module in the registry', () => {
    expect(packageForModule('mcp')).toBe('@drizztdourden08/brock-mcp');
  });
});
