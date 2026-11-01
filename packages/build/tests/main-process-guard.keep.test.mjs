/* @layer tooling-scripts @kind test */
import { build } from 'vite';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { mainProcessGuard } from '../src/build-options/main-process-guard.mjs';

const { tempDir, put, cleanup } = tempTree('brock-main-guard-');
afterEach(cleanup);

const installPackage = (root, name, files = { 'index.js': 'export default 1;\n' }) => {
  put(root, `node_modules/${name}/package.json`, JSON.stringify({ name, version: '1.0.0', type: 'module', main: 'index.js' }));
  for (const [file, content] of Object.entries(files)) put(root, `node_modules/${name}/${file}`, content);
};

const appWith = (files) => {
  const root = tempDir();
  for (const [file, content] of Object.entries(files)) put(root, file, content);
  return root;
};

const bundleMain = (root, options) =>
  build({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: [mainProcessGuard({ rootDir: root, bundle: 'main process bundle', options })],
    ssr: { noExternal: true, target: 'node' },
    build: { ssr: 'electron/main.ts', write: false, minify: false },
  });

const failureOf = async (root, options) => {
  try {
    await bundleMain(root, options);
  } catch (error) {
    return String(error.message);
  }
  return null;
};

describe('K4 the main process guard', { tags: ['e2e'] }, () => {
  it('lets a main process that stays in Node build', async () => {
    const root = appWith({
      'electron/main.ts': "import { CHANNELS } from '../src/ipc/contract.constants.ts';\nexport const main = CHANNELS;\n",
      'src/ipc/contract.constants.ts': 'export const CHANNELS = [];\n',
    });
    expect(await failureOf(root)).toBeNull();
  });

  it('fails a direct import of a renderer package and names it', async () => {
    const root = appWith({ 'electron/main.ts': "import react from 'react';\nexport default react;\n" });
    installPackage(root, 'react');
    const message = await failureOf(root);
    expect(message).toContain('The main process bundle reaches renderer-only code.');
    expect(message).toContain('electron/main.ts -> react');
  });

  it('prints the whole chain for a transitive import of renderer source', async () => {
    const root = appWith({
      'electron/main.ts': "import { a } from './services/a.ts';\nexport default a;\n",
      'electron/services/a.ts': "import { b } from './b.ts';\nexport const a = b;\n",
      'electron/services/b.ts': "import { Panel } from '../../src/views/Panel.ts';\nexport const b = Panel;\n",
      'src/views/Panel.ts': 'export const Panel = 1;\n',
    });
    expect(await failureOf(root)).toContain('electron/main.ts -> electron/services/a.ts -> electron/services/b.ts -> src/views/Panel.ts');
  });
});

describe('K4 the main process guard options', { tags: ['e2e'] }, () => {
  it('forbids a path glob of the app', async () => {
    const root = appWith({
      'electron/main.ts': "import { Card } from '../shared/ui/card.ts';\nexport default Card;\n",
      'shared/ui/card.ts': 'export const Card = 1;\n',
    });
    expect(await failureOf(root)).toBeNull();
    expect(await failureOf(root, { forbid: ['shared/ui/**'] })).toContain('electron/main.ts -> shared/ui/card.ts');
  });

  it('lets allow list an exception to the defaults and to forbid', async () => {
    const root = appWith({
      'electron/main.ts': "import { tokens } from '@drizztdourden08/tessera/tokens';\nimport { design } from '@fix/design';\nexport default [tokens, design];\n",
    });
    installPackage(root, '@drizztdourden08/tessera', { 'tokens.js': 'export const tokens = 1;\n' });
    installPackage(root, '@fix/design', { 'index.js': 'export const design = 1;\n' });
    const options = { forbid: ['@fix/design'], allow: ['@drizztdourden08/tessera/tokens', '@fix/design'] };
    expect(await failureOf(root, options)).toBeNull();
    expect(await failureOf(root, { forbid: ['@fix/design'], allow: ['@drizztdourden08/tessera/tokens'] })).toContain('@fix/design');
  });

  it('ignores a type-only import, which never reaches the bundle', async () => {
    const root = appWith({ 'electron/main.ts': "import type { ReactNode } from 'react';\nexport const none: ReactNode = null;\n" });
    installPackage(root, 'react');
    expect(await failureOf(root)).toBeNull();
  });
});
