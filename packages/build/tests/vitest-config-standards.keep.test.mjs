/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineBrockVitestConfig } from '../src/vitest-config.mjs';

vi.mock('../src/import-from-app.mjs', () => ({
  importFromApp: async () => ({ mergeConfig: (base, over) => ({ ...base, ...over, test: { ...base.test, ...over.test } }) }),
}));

let dir = '';

afterEach(() => rmSync(dir, { recursive: true, force: true }));

const configOf = (overrides) => {
  dir = mkdtempSync(join(tmpdir(), 'brock-vitest-'));
  writeFileSync(join(dir, 'package.json'), '{ "name": "app" }');
  return defineBrockVitestConfig(dir, overrides);
};

describe('K1 defineBrockVitestConfig starts from the standards preset', { tags: ['critical'] }, () => {
  it('has the forks pool, three workers, the three tags and bail, with the Brock settings on top', async () => {
    const { test } = await configOf({});
    expect(test).toMatchObject({ pool: 'forks', maxWorkers: 3, bail: 3, strictTags: true });
    expect(test.tags.map((tag) => tag.name)).toEqual(['critical', 'standard', 'e2e']);
    expect(test.server.deps.inline).toBeDefined();
  });

  it('lets the overrides win over the preset', async () => {
    const { test } = await configOf({ test: { testTimeout: 9000 } });
    expect(test.testTimeout).toBe(9000);
    expect(test.pool).toBe('forks');
  });
});
