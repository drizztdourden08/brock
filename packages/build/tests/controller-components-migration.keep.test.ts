/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, onTestFinished } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const step = () => selectMigrations(collectMigrations([]), { from: '0.80.0', to: null }).filter((m) => m.file.endsWith('controller-components-to-input.mjs'));

const migrate = async (files: Record<string, string>) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-controller-parts-'));
  onTestFinished(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'src'));
  writeFileSync(join(root, 'package.json'), '{"name":"controller-parts"}');
  for (const [name, text] of Object.entries(files)) writeFileSync(join(root, 'src', name), text);
  const run = await runMigrations(root, step());
  return { root, run, read: (name: string) => readFileSync(join(root, 'src', name), 'utf8') };
};

describe('controller-components-to-input', () => {
  it('runs once, for an app on Brock 0.80', () => {
    expect(step().map((m) => m.version)).toEqual(['0.81.0']);
    expect(selectMigrations(collectMigrations([]), { from: '0.81.0', to: null }).some((m) => m.file.endsWith('controller-components-to-input.mjs'))).toBe(false);
  });

  it('moves the three components and their types out of the composites entry, keeping what stays in Tessera', async () => {
    const source = [
      "import { Card, ControllerLayout, ControllerSilhouette, PressedGrid, StickPlot } from '@drizztdourden08/tessera/composites';",
      "import type { ControllerSlots, PressedGridItem, StickPlotRange } from '@drizztdourden08/tessera/composites';",
      '',
      'export const parts = [Card, ControllerLayout, ControllerSilhouette, PressedGrid, StickPlot];',
      '',
    ].join('\n');
    const { root, run, read } = await migrate({ 'a.tsx': source });
    const moved = read('a.tsx');
    expect(moved).toContain("import { Card, ControllerSilhouette } from '@drizztdourden08/tessera/composites';");
    expect(moved).toContain("import { ControllerLayout, PressedGrid, StickPlot } from '@drizztdourden08/brock-input/renderer';");
    expect(moved).toContain("import type { ControllerSlots, PressedGridItem, StickPlotRange } from '@drizztdourden08/brock-input/renderer';");
    expect(run.todos).toEqual([]);
    await runMigrations(root, step());
    expect(read('a.tsx')).toBe(moved);
  });

  it('moves an import from the Tessera root and merges with an input import already there', async () => {
    const source = [
      "import { useInputTester } from '@drizztdourden08/brock-input/renderer';",
      "import { ControllerLayout, Box } from '@drizztdourden08/tessera';",
      '',
      'export const parts = [useInputTester, ControllerLayout, Box];',
      '',
    ].join('\n');
    const { read } = await migrate({ 'b.tsx': source });
    const moved = read('b.tsx');
    expect(moved).toContain("import { useInputTester, ControllerLayout } from '@drizztdourden08/brock-input/renderer';");
    expect(moved).toContain("import { Box } from '@drizztdourden08/tessera';");
  });

  it('leaves a file that imports none of the three untouched', async () => {
    const source = "import { Box } from '@drizztdourden08/tessera/primitives';\nexport { Box };\n";
    const { read } = await migrate({ 'c.tsx': source });
    expect(read('c.tsx')).toBe(source);
  });
});
