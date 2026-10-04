/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const dirs: string[] = [];

const upgradeFrom = (from: string) => selectMigrations(collectMigrations([]), { from, to: null });

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('update-badge-removed', () => {
  it('turns an UpdateBadge import into a to-do, leaves the file alone and changes nothing on a second run', async () => {
    const root = mkdtempSync(join(tmpdir(), 'brock-migrate-'));
    dirs.push(root);
    mkdirSync(join(root, 'src'), { recursive: true });
    const source = "import { UpdateBadge, useUpdateAction } from '@drizztdourden08/brock-updater/renderer';\nexport { UpdateBadge, useUpdateAction };\n";
    const other = "import { useUpdateAction } from '@drizztdourden08/brock-updater/renderer';\nexport { useUpdateAction };\n";
    writeFileSync(join(root, 'package.json'), '{"name":"x"}');
    writeFileSync(join(root, 'src', 'bar.tsx'), source);
    writeFileSync(join(root, 'src', 'other.tsx'), other);
    const only = upgradeFrom('0.15.0').filter((m) => m.file.endsWith('update-badge-removed.mjs'));
    expect(only).toHaveLength(1);
    const run = await runMigrations(root, only);
    expect(readFileSync(join(root, 'src', 'bar.tsx'), 'utf8')).toBe(source);
    expect(run.todos).toHaveLength(1);
    expect(run.todos[0]?.message).toContain('useUpdateAction');
    await runMigrations(root, only);
    expect(readFileSync(join(root, 'src', 'bar.tsx'), 'utf8')).toBe(source);
    expect(readFileSync(join(root, 'src', 'other.tsx'), 'utf8')).toBe(other);
    expect(upgradeFrom('0.16.0').some((m) => m.file.endsWith('update-badge-removed.mjs'))).toBe(false);
  });
});
