/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it, onTestFinished } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const step = (from = '0.95.0') => selectMigrations(collectMigrations([]), { from, to: null }).filter((m) => m.file.endsWith('controllers-bucket.mjs'));

const migrate = async (files: Record<string, string>) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-controllers-bucket-'));
  onTestFinished(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, 'package.json'), '{"name":"controllers-bucket"}');
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), text);
  }
  const run = await runMigrations(root, step());
  return run.todos.map(({ file, line }) => `${file}:${line}`).sort();
};

describe('controllers-bucket', () => {
  it('runs once, for an app on Brock 0.95', () => {
    expect(step().map((m) => m.version)).toEqual(['0.96.0']);
    expect(step('0.96.0')).toEqual([]);
  });

  it('flags imports of the removed tester pieces from the input module', async () => {
    const todos = await migrate({
      'src/a.tsx': [
        "import { InputTester, DeviceCard, registerDeviceCardActions } from '@drizztdourden08/brock-input/renderer';",
        "import type { CalibrationPanelProps } from '@drizztdourden08/brock-input/renderer';",
        '',
      ].join('\n'),
      'src/b.tsx': "import { DeviceCard } from './my-cards';\n",
    });
    expect(todos).toEqual(['src/a.tsx:1', 'src/a.tsx:1', 'src/a.tsx:2']);
  });

  it('flags imports of ControllerLayout and its types', async () => {
    const todos = await migrate({
      'src/a.tsx': [
        "import { ControllerLayout, CONTROLLER_SLOT_IDS } from '@drizztdourden08/brock-input/renderer';",
        "import type { ControllerLayoutProps, ControllerSlots } from '@drizztdourden08/brock-input/renderer';",
        '',
      ].join('\n'),
    });
    expect(todos).toEqual(['src/a.tsx:1', 'src/a.tsx:2', 'src/a.tsx:2']);
  });

  it('flags the input-tester id and an input override with no screens', async () => {
    const todos = await migrate({
      'src/main.tsx': [
        "import { inputRenderer } from '@drizztdourden08/brock-input/renderer';",
        '',
        "const input = { ...inputRenderer, screens: [], menu: [{ key: 'controllers', screen: 'controllers' }] };",
        "const link = 'input-tester';",
        '',
      ].join('\n'),
    });
    expect(todos).toEqual(['src/main.tsx:3', 'src/main.tsx:4']);
  });

  it('flags a controllers bucket in screens.config.ts only', async () => {
    const todos = await migrate({
      'src/screens/screens.config.ts': "export default { buckets: [{ id: 'controllers', title: 'Pads' }] };\n",
      'src/other.ts': "export const bucket = { id: 'controllers' };\n",
    });
    expect(todos).toEqual(['src/screens/screens.config.ts:1']);
  });
});
