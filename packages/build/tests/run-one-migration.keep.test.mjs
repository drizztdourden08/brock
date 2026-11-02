/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { collectMigrations } from '../src/upgrade/collect-migrations.mjs';
import { selectById } from '../src/upgrade/select-by-id.mjs';

describe('K1 selectById, behind brock migrate --run <id>', { tags: ['critical'] }, () => {
  it('finds one migration by id whatever its version folder, and none for an unknown id', async () => {
    const all = collectMigrations([]);
    const found = await selectById(all, 'documents-access-async');
    expect(found).toHaveLength(1);
    expect(found[0]?.version).toBe('0.81.0');
    expect(await selectById(all, 'no-such-migration')).toEqual([]);
  });
});
