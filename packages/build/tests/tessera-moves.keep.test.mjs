/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, importMoves, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { releaseMoves } from '../src/upgrade/tessera/release-moves.mjs';
import { tesseraRenamesStep } from '../src/upgrade/tessera/tessera-renames-step.mjs';

const made = [];

const T = '@drizztdourden08/tessera';

const RELEASES = [
  {
    version: '0.17.0',
    components: { StatusOf: 'Status' },
    moves: {
      CopyButton: { from: 'primitives', to: 'composites' },
      CopyButtonProps: { from: 'primitives', to: 'composites' },
      ErrorBoundary: { from: 'composites', to: 'primitives' },
    },
  },
  {
    version: '0.20.0',
    components: { PathField: 'PathInput', PathFieldProps: 'PathInputProps' },
    moves: {
      Toast: { from: 'primitives', to: 'composites' },
      ToastProps: { from: 'primitives', to: 'composites' },
      PathInput: { from: 'primitives', to: 'composites' },
      PathInputProps: { from: 'primitives', to: 'composites' },
      Splash: { from: 'primitives', to: 'composites' },
      Overlay: { from: 'composites', to: 'primitives' },
      PixelWordmark: { from: 'composites', to: 'brand' },
    },
  },
];

const put = (root, file, text) => {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), text);
};

const app = (view) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-tessera-moves-'));
  made.push(root);
  put(root, 'package.json', JSON.stringify({ name: 'app', brock: { version: '0.22.0', tessera: '0.16.1' } }));
  put(root, `node_modules/${T}/package.json`, JSON.stringify({ name: T, version: '0.20.0' }));
  put(root, `node_modules/${T}/RENAMES.json`, JSON.stringify({ releases: RELEASES }));
  put(root, 'src/view.tsx', view);
  return root;
};

const read = (root) => readFileSync(join(root, 'src/view.tsx'), 'utf8');

const replay = (root) => tesseraRenamesStep({ rootDir: root, from: '0.16.1' });

const tierMoves = () => selectMigrations(collectMigrations([]), { from: '0.22.0', to: null }).filter((m) => m.file.endsWith('tessera-tier-moves.mjs'));

const move = (source, moves) => importMoves({ moves, noTypescript: 'no TypeScript' })({ path: 'src/a.tsx', source }).source;

const MOVES = [
  { from: `${T}/primitives`, to: `${T}/composites`, names: new Set(['CopyButton', 'CopyButtonProps', 'Toast']) },
  { from: `${T}/composites`, to: `${T}/brand`, names: new Set(['PixelWordmark']) },
  { from: `${T}/data`, to: `${T}/field-kits`, names: new Set(['FieldKit']) },
];

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('releaseMoves', () => {
  it('groups a release by entry pair under the package name, and drops the root and same-entry moves', () => {
    const groups = releaseMoves({ moves: { A: { from: 'primitives', to: 'composites' }, B: { from: 'primitives', to: 'composites' }, C: { from: 'data', to: 'field-kits' }, D: { from: '.', to: 'composites' }, E: { from: 'brand', to: 'brand' } } });
    expect(groups).toEqual([
      { from: `${T}/primitives`, to: `${T}/composites`, names: new Set(['A', 'B']) },
      { from: `${T}/data`, to: `${T}/field-kits`, names: new Set(['C']) },
    ]);
    expect(releaseMoves({ version: '0.18.0' })).toEqual([]);
  });
});

describe('the Tessera renames step replays moves', () => {
  it('moves CopyButton and Toast from /primitives to /composites when replayed from 0.16.1', () => {
    const root = app(`import { Box, CopyButton, Toast } from '${T}/primitives';\nimport { Widget } from '${T}/composites';\n`);
    const run = replay(root);
    expect(run.applied.map((entry) => entry.version)).toEqual(['0.17.0', '0.20.0']);
    expect(read(root)).toBe(`import { Box } from '${T}/primitives';\nimport { Widget, CopyButton, Toast } from '${T}/composites';\n`);
    expect(run.applied.flatMap((entry) => entry.todos)).toEqual([]);
  });

  it('moves a part under the name the same release gave it, and leaves the root import alone', () => {
    const root = app(`import { PathField, type PathFieldProps } from '${T}/primitives';\nimport { Toast } from '${T}';\nconst a = <PathField />;\n`);
    replay(root);
    expect(read(root)).toBe(`import { PathInput, type PathInputProps } from '${T}/composites';\nimport { Toast } from '${T}';\nconst a = <PathInput />;\n`);
  });

  it('changes nothing on a second replay', () => {
    const root = app(`import { CopyButton, Overlay, PixelWordmark, Widget } from '${T}/composites';\nimport { Toast } from '${T}/primitives';\n`);
    replay(root);
    const once = read(root);
    replay(root);
    expect(read(root)).toBe(once);
    expect(once).toContain(`import { CopyButton, Widget, Toast } from '${T}/composites';`);
  });
});

describe('the tessera-tier-moves migration and the moves replay together', () => {
  const SOURCE = `import { Box, PathField, Toast, Splash } from '${T}/primitives';\nimport type { ToastProps } from '${T}/primitives';\nimport { Widget, Overlay } from '${T}/composites';\nconst a = <PathField />;\n`;
  const EXPECTED = [
    `import { Box, Overlay } from '${T}/primitives';`,
    `import type { ToastProps } from '${T}/composites';`,
    `import { Widget, PathInput, Toast, Splash } from '${T}/composites';`,
    'const a = <PathInput />;',
    '',
  ].join('\n');

  it('migration first, then the replay, as brock upgrade runs them, and again: the same imports, none twice', async () => {
    const root = app(SOURCE);
    await runMigrations(root, tierMoves());
    replay(root);
    expect(read(root)).toBe(EXPECTED);
    await runMigrations(root, tierMoves());
    replay(root);
    expect(read(root)).toBe(EXPECTED);
  });

  it('the replay first, then the migration: the same result, with no duplicate import', async () => {
    const root = app(SOURCE);
    replay(root);
    expect(read(root)).toBe(EXPECTED);
    await runMigrations(root, tierMoves());
    expect(read(root)).toBe(EXPECTED);
  });
});

describe('importMoves', () => {
  it('splits a mixed import line between its old entry and each new one', () => {
    const source = `import { Box, CopyButton, type CopyButtonProps, PixelWordmark, Toast as Toaster } from '${T}/primitives';\n`;
    expect(move(source, MOVES)).toBe(`import { Box, PixelWordmark } from '${T}/primitives';\nimport { CopyButton, type CopyButtonProps, Toast as Toaster } from '${T}/composites';\n`);
    const composites = `import { PixelWordmark, Widget } from '${T}/composites';\n`;
    expect(move(composites, MOVES)).toBe(`import { Widget } from '${T}/composites';\nimport { PixelWordmark } from '${T}/brand';\n`);
  });

  it('moves a part between any two entry points, such as data and field-kits', () => {
    expect(move(`import { FieldKit, Table } from "${T}/data";\n`, MOVES)).toBe(`import { Table } from "${T}/data";\nimport { FieldKit } from "${T}/field-kits";\n`);
  });

  it('moves a re-export, whole or split, and joins one already there', () => {
    const whole = `export { CopyButton } from '${T}/primitives';\nexport type { CopyButtonProps } from '${T}/primitives';\n`;
    expect(move(whole, MOVES)).toBe(`export { CopyButton } from '${T}/composites';\nexport type { CopyButtonProps } from '${T}/composites';\n`);
    const split = `export { Box, CopyButton as Copy } from '${T}/primitives';\nexport { Widget } from '${T}/composites';\n`;
    expect(move(split, MOVES)).toBe(`export { Box } from '${T}/primitives';\nexport { Widget, CopyButton as Copy } from '${T}/composites';\n`);
    const both = `import { Toast } from '${T}/primitives';\nexport { Toast } from '${T}/primitives';\n`;
    expect(move(both, MOVES)).toBe(`import { Toast } from '${T}/composites';\nexport { Toast } from '${T}/composites';\n`);
  });

  it('keeps the default import where it is and moves only the named ones', () => {
    expect(move(`import Tessera, { CopyButton } from '${T}/primitives';\n`, MOVES)).toBe(`import Tessera from '${T}/primitives';\nimport { CopyButton } from '${T}/composites';\n`);
    expect(move(`import Tessera, { Box, Toast } from '${T}/primitives';\nimport { Widget } from '${T}/composites';\n`, MOVES))
      .toBe(`import Tessera, { Box } from '${T}/primitives';\nimport { Widget, Toast } from '${T}/composites';\n`);
  });

  it('drops a name the new entry already imports instead of writing it twice', () => {
    const source = `import { Box, Toast } from '${T}/primitives';\nimport { Toast, Widget } from '${T}/composites';\n`;
    expect(move(source, MOVES)).toBe(`import { Box } from '${T}/primitives';\nimport { Toast, Widget } from '${T}/composites';\n`);
  });

  it('leaves the root import, a namespace import and export star alone', () => {
    const source = `import { CopyButton } from '${T}';\nimport * as P from '${T}/primitives';\nexport * from '${T}/primitives';\n`;
    expect(move(source, MOVES)).toBe(source);
  });
});
