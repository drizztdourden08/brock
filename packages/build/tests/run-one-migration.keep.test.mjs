/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations } from '../src/upgrade/collect-migrations.mjs';
import { runMigrations } from '../src/upgrade/run-migrations.mjs';
import { selectById } from '../src/upgrade/select-by-id.mjs';

const dirs = [];

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('selectById, behind brock migrate --run <id>', () => {
  it('finds one migration by id whatever its version folder, and none for an unknown id', async () => {
    const all = collectMigrations([]);
    const found = await selectById(all, 'documents-access-async');
    expect(found).toHaveLength(1);
    expect(found[0]?.version).toBe('0.81.0');
    expect(await selectById(all, 'no-such-migration')).toEqual([]);
  });

  it('runs only that migration over the app', async () => {
    const root = mkdtempSync(join(tmpdir(), 'brock-run-one-'));
    dirs.push(root);
    mkdirSync(join(root, 'src'), { recursive: true });
    writeFileSync(join(root, 'src', 'files.ts'), 'const full = ctx.documents.resolve(path);\n');
    const run = await runMigrations(root, await selectById(collectMigrations([]), 'documents-access-async'));
    expect(run.applied.map((m) => m.id)).toEqual(['documents-access-async']);
    expect(run.todos.map((todo) => todo.file)).toEqual(['src/files.ts']);
  });
});
