/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { runMigrations } from '../src/upgrade/index.mjs';

const made = [];

const sampleRepo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-design-'));
  made.push(root);
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), text);
  }
  return root;
};

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('K1 workspace steps in the runner', { tags: ['critical'] }, () => {
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
