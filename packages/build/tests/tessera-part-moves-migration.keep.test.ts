/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const dirs: string[] = [];

const step = () => selectMigrations(collectMigrations([]), { from: '0.18.0', to: null }).filter((m) => m.file.endsWith('tessera-part-moves.mjs'));

const migrate = async (files: Record<string, string>) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-migrate-'));
  dirs.push(root);
  mkdirSync(join(root, 'src'), { recursive: true });
  writeFileSync(join(root, 'package.json'), '{"name":"x"}');
  for (const [name, text] of Object.entries(files)) writeFileSync(join(root, 'src', name), text);
  const run = await runMigrations(root, step());
  const read = (name: string) => readFileSync(join(root, 'src', name), 'utf8');
  return { root, run, read };
};

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('tessera-part-moves', () => {
  it('runs once, for an app on Brock 0.18', () => {
    expect(step()).toHaveLength(1);
    expect(selectMigrations(collectMigrations([]), { from: '0.19.0', to: null }).some((m) => m.file.endsWith('tessera-part-moves.mjs'))).toBe(false);
  });

  it('moves CopyButton out of a primitives import into a new composites import, and changes nothing on a second run', async () => {
    const source = "import { Box, CopyButton, type CopyButtonProps } from '@drizztdourden08/tessera/primitives';\nexport { Box, CopyButton };\nexport type { CopyButtonProps };\n";
    const { root, run, read } = await migrate({ 'a.tsx': source });
    const moved = read('a.tsx');
    expect(moved).toContain("import { Box } from '@drizztdourden08/tessera/primitives';");
    expect(moved).toContain("import { CopyButton, type CopyButtonProps } from '@drizztdourden08/tessera/composites';");
    expect(run.todos).toEqual([]);
    await runMigrations(root, step());
    expect(read('a.tsx')).toBe(moved);
  });

  it('joins an existing composites import, points a whole import at its new entry and moves ErrorBoundary to the primitives', async () => {
    const joined = "import { CopyValue, Stack } from '@drizztdourden08/tessera/primitives';\nimport { Widget } from '@drizztdourden08/tessera/composites';\n";
    const whole = "import type { CopyText } from '@drizztdourden08/tessera/primitives';\nimport { ErrorBoundary } from '@drizztdourden08/tessera/composites';\n";
    const hosted = "import { CopyButton } from '@drizztdourden08/tessera/primitives';\nimport { Widget } from '@drizztdourden08/tessera/composites';\n";
    const { read } = await migrate({ 'joined.tsx': joined, 'whole.ts': whole, 'hosted.tsx': hosted });
    expect(read('hosted.tsx')).toBe("import { Widget, CopyButton } from '@drizztdourden08/tessera/composites';\n");
    expect(read('joined.tsx')).toBe("import { Stack } from '@drizztdourden08/tessera/primitives';\nimport { Widget, CopyValue } from '@drizztdourden08/tessera/composites';\n");
    expect(read('whole.ts')).toBe("import type { CopyText } from '@drizztdourden08/tessera/composites';\nimport { ErrorBoundary } from '@drizztdourden08/tessera/primitives';\n");
  });

  it('leaves the root import and other parts alone', async () => {
    const source = "import { CopyButton } from '@drizztdourden08/tessera';\nimport { StatRow } from '@drizztdourden08/tessera/primitives';\n";
    const { read } = await migrate({ 'b.tsx': source });
    expect(read('b.tsx')).toBe(source);
  });
});
