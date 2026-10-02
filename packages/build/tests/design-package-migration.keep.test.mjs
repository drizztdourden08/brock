/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const made = [];

const write = (root, files) => {
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), typeof text === 'string' ? text : `${JSON.stringify(text, null, 2)}\n`);
  }
  return root;
};

const sampleRepo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-design-'));
  made.push(root);
  return write(root, files);
};

const read = (root, file) => readFileSync(join(root, file), 'utf8');

const HEADER = '/* @layer renderer-app @kind component */\n';

const MONOREPO = {
  'package.json': { name: 'acme', license: 'UNLICENSED' },
  'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n  - 'packages/*'\n",
  'brock.workspace.mjs': "export default defineWorkspace({ name: 'acme', base: 'main' });\n",
  'knip.json': { workspaces: { 'apps/desktop': { entry: ['src/main.tsx'] } } },
  'apps/desktop/package.json': { name: '@acme/desktop', dependencies: { react: 'catalog:', '@drizztdourden08/tessera': 'link:X:/tessera' }, devDependencies: { typescript: 'catalog:', eslint: 'catalog:' } },
  'apps/desktop/brock.config.ts': 'export default {};\n',
  'apps/desktop/src/theme.css': ':root { --p-primary: #123456; }\n',
  'apps/desktop/src/compounds/Card/Card.tsx': `${HEADER}import { Box } from '@drizztdourden08/tessera/primitives';\nimport './Card.css';\n`,
  'apps/desktop/src/compounds/Card/Card.css': '.card { color: inherit; }\n',
  'apps/desktop/src/compounds/Card/Card.type.ts': 'interface CardProps { title: string }\nexport type { CardProps };\n',
  'apps/desktop/src/compounds/Card/index.ts': "export { Card } from './Card';\nexport type { CardProps } from './Card.type';\n",
  'apps/desktop/src/compounds/Row/Row.tsx': `${HEADER}import { useState } from 'react';\nimport { Card } from '../Card';\n`,
  'apps/desktop/src/compounds/Row/index.ts': "export { Row } from './Row';\n",
  'apps/desktop/src/compounds/Deep/Deep.tsx': HEADER,
  'apps/desktop/src/compounds/Deep/behavior/deep-label.ts': 'const deepLabel = 1;\nexport { deepLabel };\n',
  'apps/desktop/src/compounds/Deep/index.ts': "export { Deep } from './Deep';\n",
  'apps/desktop/src/compounds/Lonely/Lonely.tsx': `${HEADER}import { store } from '../../state/store';\n`,
  'apps/desktop/src/compounds/Lonely/index.ts': "export { Lonely } from './Lonely';\n",
  'apps/desktop/src/state/store.ts': 'const store = {};\nexport { store };\n',
  'apps/desktop/src/views/Home/Home.tsx': [
    HEADER,
    "import { Card } from '../../compounds/Card';",
    "import { Row } from '../../compounds/Row';",
    "import type { CardProps } from '@app/compounds/Card';",
    "import { Lonely } from '../../compounds/Lonely';",
    '',
  ].join('\n'),
  'apps/desktop/src/option-fields/Thing/Thing.tsx': HEADER,
  'apps/desktop/tests/deep.keep.test.ts': "import { deepLabel } from '../src/compounds/Deep/behavior/deep-label';\n",
};

const designStep = () => selectMigrations(collectMigrations([]), { from: '0.1.2', to: '0.1.3' }).filter((m) => m.file.endsWith('design-package.mjs'));

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('the design-package migration in a monorepo', () => {
  it('creates packages/design and points tessera.config.json at it, one apps entry per app', async () => {
    const root = sampleRepo(MONOREPO);
    await runMigrations(join(root, 'apps/desktop'), designStep());
    expect(JSON.parse(read(root, 'tessera.config.json'))).toEqual({
      $schema: './node_modules/@drizztdourden08/tessera/tessera.config.schema.json',
      package: '@acme/design',
      parts: { primitives: 'packages/design/src/primitives', composites: 'packages/design/src/composites', compounds: 'packages/design/src/compounds' },
      stories: 'packages/design/stories',
      apps: { 'apps/desktop': { parts: { views: 'apps/desktop/src/views' }, theme: { css: 'apps/desktop/src/theme.css' } } },
    });
    const pkg = JSON.parse(read(root, 'packages/design/package.json'));
    expect(pkg).toMatchObject({ name: '@acme/design', license: 'UNLICENSED', exports: { '.': './src/index.ts' }, devDependencies: { typescript: 'catalog:', eslint: 'catalog:' } });
    expect(pkg.dependencies).toEqual({ '@drizztdourden08/tessera': 'link:X:/tessera', react: 'catalog:' });
    expect(['primitives', 'composites', 'compounds'].every((kind) => existsSync(join(root, 'packages/design/src', kind)))).toBe(true);
    expect(JSON.parse(read(root, 'knip.json')).workspaces['packages/design'].project).toEqual(['src/**/*.{ts,tsx}']);
  });

  it('moves the compounds whose every import it can rewrite, and rewrites those imports', async () => {
    const root = sampleRepo(MONOREPO);
    await runMigrations(join(root, 'apps/desktop'), designStep());
    expect(existsSync(join(root, 'packages/design/src/compounds/Card/Card.css'))).toBe(true);
    expect(read(root, 'packages/design/src/compounds/Row/Row.tsx')).toContain("import { Card } from '../Card';");
    expect(existsSync(join(root, 'apps/desktop/src/compounds/Card'))).toBe(false);
    expect(read(root, 'packages/design/src/index.ts')).toBe([
      '/* @layer renderer-app @kind barrel */',
      "export { Card } from './compounds/Card';",
      "export type { CardProps } from './compounds/Card';",
      "export { Row } from './compounds/Row';",
      '',
    ].join('\n'));
    const home = read(root, 'apps/desktop/src/views/Home/Home.tsx');
    expect(home).toContain("import { Card, Row } from '@acme/design';");
    expect(home).toContain("import type { CardProps } from '@acme/design';");
    expect(home).toContain("import { Lonely } from '../../compounds/Lonely';");
    expect(JSON.parse(read(root, 'apps/desktop/package.json')).dependencies['@acme/design']).toBe('workspace:*');
  });

  it('leaves a to-do for each compound it cannot move and each stray component', async () => {
    const root = sampleRepo(MONOREPO);
    const { todos } = await runMigrations(join(root, 'apps/desktop'), designStep());
    expect(todos.map((todo) => todo.file)).toEqual(['src/compounds/Deep', 'src/compounds/Lonely', 'src/option-fields/Thing', '../../package.json']);
    expect(todos[0].message).toContain('apps/desktop/tests/deep.keep.test.ts:1 imports ../src/compounds/Deep/behavior/deep-label past its index.ts');
    expect(todos[1].message).toContain('apps/desktop/src/compounds/Lonely/Lonely.tsx:2 imports ../../state/store, outside the compound');
    expect(todos[3].message).toContain('pnpm install');
  });

  it('changes nothing on a second run', async () => {
    const root = sampleRepo(MONOREPO);
    await runMigrations(join(root, 'apps/desktop'), designStep());
    const again = await runMigrations(join(root, 'apps/desktop'), designStep());
    expect(again.applied[0].touched).toEqual([]);
    expect(again.todos.map((todo) => todo.file)).toEqual(['src/compounds/Deep', 'src/compounds/Lonely', 'src/option-fields/Thing']);
  });
});

describe('the design-package migration in a single-app repo', () => {
  it('writes a tessera.config.json that holds only $schema, and keeps one that exists', async () => {
    const root = sampleRepo({ 'package.json': { name: 'solo' }, 'pnpm-workspace.yaml': 'packages: []\n', 'brock.config.ts': 'export default {};\n', 'src/theme.css': '' });
    const run = await runMigrations(root, designStep());
    expect(run.applied[0].touched).toEqual(['tessera.config.json']);
    expect(JSON.parse(read(root, 'tessera.config.json'))).toEqual({ $schema: './node_modules/@drizztdourden08/tessera/tessera.config.schema.json' });
    expect(existsSync(join(root, 'packages'))).toBe(false);
    expect((await runMigrations(root, designStep())).applied[0].touched).toEqual([]);
  });
});

describe('workspace steps in the runner', () => {
  const MOVER = [
    "import { mkdirSync, renameSync } from 'node:fs';",
    "import { join } from 'node:path';",
    'const migration = { id: "mover", summary: "", workspace: ({ rootDir }) => {',
    "  mkdirSync(join(rootDir, 'lib'), { recursive: true });",
    "  renameSync(join(rootDir, 'src', 'old.ts'), join(rootDir, 'lib', 'old.ts'));",
    "  return { touched: ['lib/old.ts'], moved: [{ from: 'src/old.ts', to: 'lib/old.ts' }], todos: [{ file: 'lib', message: 'check lib' }] };",
    '} };',
    'export { migration };',
    '',
  ].join('\n');
  const MARKER = 'const migration = { id: "marker", summary: "", files: /\\.ts$/, apply: ({ source }) => ({ source, todos: [{ line: 1, message: "seen" }] }) };\nexport { migration };\n';

  it('runs the file steps of a version first, then its workspace steps, and carries earlier to-dos along a move', async () => {
    const root = sampleRepo({ 'src/old.ts': 'export {};\n', 'm/a-mover.mjs': MOVER, 'm/b-marker.mjs': MARKER });
    const entries = ['a-mover', 'b-marker'].map((name) => ({ version: '9.0.0', file: join(root, 'm', `${name}.mjs`), source: 'test', summary: null }));
    const run = await runMigrations(root, entries);
    expect(run.applied.map((m) => m.id)).toEqual(['marker', 'mover']);
    expect(run.todos.map((todo) => `${todo.migration} ${todo.file}`)).toEqual(['marker lib/old.ts', 'mover lib']);
    expect(existsSync(join(root, 'lib', 'old.ts'))).toBe(true);
  });

  it('refuses a migration with neither step', async () => {
    const root = sampleRepo({ 'm/bad.mjs': 'const migration = { id: "bad" };\nexport { migration };\n' });
    await expect(runMigrations(root, [{ version: '9.0.0', file: join(root, 'm', 'bad.mjs'), source: 'test', summary: null }])).rejects.toThrow(/or \{ id, summary, workspace \}/);
  });
});
