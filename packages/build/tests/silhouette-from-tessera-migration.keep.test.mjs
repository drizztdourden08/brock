/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { tempTree } from './temp-tree.mjs';

const tree = tempTree('brock-silhouette-');

afterEach(() => tree.cleanup());

const step = () => selectMigrations(collectMigrations([]), { from: '0.96.0', to: null }).filter((m) => m.file.endsWith('silhouette-from-tessera.mjs'));

const migrate = async (files) => {
  const root = tree.tempDir();
  tree.put(root, 'package.json', '{"name":"silhouette"}');
  Object.entries(files).forEach(([name, text]) => tree.put(root, `src/${name}`, text));
  const run = await runMigrations(root, step());
  const read = (name) => readFileSync(join(root, 'src', name), 'utf8');
  return { root, run, read };
};

describe('silhouette-from-tessera', () => {
  it('runs once, for an app on Brock 0.97.0 or older', () => {
    expect(step().map((m) => m.version)).toEqual(['0.97.1']);
    expect(selectMigrations(collectMigrations([]), { from: '0.97.1', to: null }).some((m) => m.file.endsWith('silhouette-from-tessera.mjs'))).toBe(false);
  });

  it('moves the component and its props to Tessera and keeps the anchors in the input module', async () => {
    const source = [
      "import { CONTROLLER_SILHOUETTE_ANCHORS, ControllerSilhouette, PadOverlay } from '@drizztdourden08/brock-input/renderer';",
      "import type { ControllerSilhouetteAnchorSet, ControllerSilhouetteProps } from '@drizztdourden08/brock-input/renderer';",
      '',
      'export const parts = [CONTROLLER_SILHOUETTE_ANCHORS, ControllerSilhouette, PadOverlay];',
      '',
    ].join('\n');
    const { root, run, read } = await migrate({ 'a.tsx': source });
    const moved = read('a.tsx');
    expect(moved).toContain("import { CONTROLLER_SILHOUETTE_ANCHORS, PadOverlay } from '@drizztdourden08/brock-input/renderer';");
    expect(moved).toContain("import { ControllerSilhouette } from '@drizztdourden08/tessera/composites';");
    expect(moved).toContain("import type { ControllerSilhouetteAnchorSet } from '@drizztdourden08/brock-input/renderer';");
    expect(moved).toContain("import type { ControllerSilhouetteProps } from '@drizztdourden08/tessera/composites';");
    expect(run.todos).toEqual([]);
    await runMigrations(root, step());
    expect(read('a.tsx')).toBe(moved);
  });

  it('leaves a file that imports none of them untouched', async () => {
    const source = "import { PadOverlay } from '@drizztdourden08/brock-input/renderer';\nexport { PadOverlay };\n";
    const { read } = await migrate({ 'b.tsx': source });
    expect(read('b.tsx')).toBe(source);
  });
});
