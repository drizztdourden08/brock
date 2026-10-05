/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const roots: string[] = [];

const step = () => selectMigrations(collectMigrations([]), { from: '0.18.0', to: null }).filter((m) => m.file.endsWith('tessera-part-moves.mjs'));

const steps = () => selectMigrations(collectMigrations([]), { from: '0.22.0', to: null }).filter((m) => m.version === '0.23.0');

const steps025 = () => selectMigrations(collectMigrations([]), { from: '0.24.1', to: null }).filter((m) => m.version === '0.25.0');

const appWith = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-part-moves-'));
  const src = join(root, 'src');
  roots.push(root);
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'moves' }));
  mkdirSync(src);
  Object.entries(files).forEach(([name, text]) => writeFileSync(join(src, name), text));
  return root;
};

const migrate = async (files: Record<string, string>, chosen = step()) => {
  const root = appWith(files);
  const run = await runMigrations(root, chosen);
  return { root, run, read: (name: string) => readFileSync(join(root, 'src', name), 'utf8') };
};

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
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

describe('tessera-tier-moves', () => {
  it('runs for an app on Brock 0.22 only', () => {
    expect(steps().map((m) => m.file.replace(/\\/g, '/').split('/').at(-1))).toEqual(expect.arrayContaining(['tessera-tier-moves.mjs', 'menu-confirm-store.mjs']));
    expect(selectMigrations(collectMigrations([]), { from: '0.23.0', to: null }).some((m) => m.file.endsWith('tessera-tier-moves.mjs'))).toBe(false);
  });

  it('moves PathField, Toast and Splash to the composites before the renames, and changes nothing on a second run', async () => {
    const source = "import { Box, PathField, ToastContainer, Splash } from '@drizztdourden08/tessera/primitives';\nimport type { PathKind, SplashAction } from '@drizztdourden08/tessera/primitives';\n";
    const { root, read } = await migrate({ 'a.tsx': source }, steps());
    const moved = read('a.tsx');
    expect(moved).toBe([
      "import { Box } from '@drizztdourden08/tessera/primitives';",
      "import { PathField, ToastContainer, Splash } from '@drizztdourden08/tessera/composites';",
      "import type { PathKind, SplashAction } from '@drizztdourden08/tessera/composites';",
      '',
    ].join('\n'));
    await runMigrations(root, steps());
    expect(read('a.tsx')).toBe(moved);
  });

  it('splits one composites import three ways: Overlay to the primitives, PixelWordmark to the brand entry', async () => {
    const source = "import { Overlay, PixelWordmark, Widget } from '@drizztdourden08/tessera/composites';\n";
    const { read } = await migrate({ 'b.tsx': source }, steps());
    const moved = read('b.tsx');
    expect(moved).toContain("import { Widget } from '@drizztdourden08/tessera/composites';");
    expect(moved).toContain("import { Overlay } from '@drizztdourden08/tessera/primitives';");
    expect(moved).toContain("import { PixelWordmark } from '@drizztdourden08/tessera/brand';");
  });

  it('leaves the root import alone', async () => {
    const source = "import { Splash, Overlay } from '@drizztdourden08/tessera';\n";
    const { read } = await migrate({ 'c.tsx': source }, steps());
    expect(read('c.tsx')).toBe(source);
  });
});

describe('menu-confirm-store', () => {
  it('lists each use of the removed confirm store and of MenuResolver armed', async () => {
    const source = [
      "import { useMenuConfirmStore, toMenuGroups } from '@drizztdourden08/brock-react';",
      'const groups = toMenuGroups(entries, { openScreen, armed: null });',
      '',
    ].join('\n');
    const { run } = await migrate({ 'menu.ts': source }, steps());
    const found = run.todos.filter((todo) => todo.migration === 'menu-confirm-store').map((todo) => todo.line);
    expect(found).toEqual([1, 2]);
  });
});

describe('Brock 0.25 migrations', () => {
  it('run for an app on Brock 0.24 only', () => {
    expect(steps025().map((m) => m.file.replace(/\\/g, '/').split('/').at(-1))).toEqual(expect.arrayContaining(['screen-layer-back.mjs', 'toast-store-gone.mjs']));
    expect(selectMigrations(collectMigrations([]), { from: '0.25.0', to: null }).some((m) => m.version === '0.25.0')).toBe(false);
  });

  it('turns ScreenLayer onBack into back with onSelect, and changes nothing on a second run', async () => {
    const source = 'export const A = () => <ScreenLayer title="Tools" icon={null} onBack={() => nav.back()} onClose={close}>x</ScreenLayer>;\n';
    const { root, run, read } = await migrate({ 'a.tsx': source }, steps025());
    const moved = read('a.tsx');
    expect(moved).toBe('export const A = () => <ScreenLayer title="Tools" icon={null} back={{ onSelect: () => nav.back() }} onClose={close}>x</ScreenLayer>;\n');
    expect(run.todos).toEqual([]);
    await runMigrations(root, steps025());
    expect(read('a.tsx')).toBe(moved);
  });

  it('leaves onBack on other parts alone, and makes an object onBack beside ScreenLayer a to-do', async () => {
    const other = 'export const B = () => <Pager onBack={back} />;\n';
    const object = "createElement(ScreenLayer, { title: 'Tools', onBack: back });\n";
    const { run, read } = await migrate({ 'b.tsx': other, 'c.ts': object }, steps025());
    expect(read('b.tsx')).toBe(other);
    expect(read('c.ts')).toBe(object);
    expect(run.todos.map((todo: { file: string }) => todo.file)).toEqual(['src/c.ts']);
  });

  it('makes a read of the old toast store a to-do', async () => {
    const { run } = await migrate({ 'd.ts': "import { useToastStore } from '@drizztdourden08/brock-react';\nuseToastStore.getState().clear();\n" }, steps025());
    expect(run.todos).toHaveLength(2);
    expect(run.todos[0]).toMatchObject({ migration: 'toast-store-gone', line: 1 });
  });
});
