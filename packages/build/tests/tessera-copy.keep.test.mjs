/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { runMigrate } from '../src/commands/migrate.mjs';
import { tesseraCopyStep } from '../src/upgrade/tessera-copy/tessera-copy-step.mjs';

const TESSERA_DIR = dirname(createRequire(import.meta.url).resolve('@drizztdourden08/tessera/package.json'));
const TESSERA_VERSION = JSON.parse(readFileSync(join(TESSERA_DIR, 'package.json'), 'utf8')).version;
const COPY = 'apps/web/src/ui/design-system';
const VIEWS = 'apps/web/src/ui/domains/app';

const STATUS_BADGE = `/* @layer renderer-components @kind component */
import { Badge } from '../../../../design-system/primitives/Badge';
import type { ControllerStatusBadgeProps } from './ControllerStatusBadge.type';

const LABEL = { ready: 'Ready', unavailable: 'Unavailable' } as const;

const ControllerStatusBadge = (props: ControllerStatusBadgeProps) => {
  const { status } = props;
  return <Badge variant={status === 'ready' ? 'success' : 'warning'}>{LABEL[status]}</Badge>;
};

export { ControllerStatusBadge };
`;

const ASPECT_RATIO = `/* @layer renderer-components @kind component */
import { useState } from 'react';
import { SegmentedControl } from '../../../../../design-system/primitives/SegmentedControl';
import type { SegmentOption } from '../../../../../design-system/primitives/SegmentedControl';
import { Stepper } from '../../../../../design-system/primitives/Stepper';
import { Box } from '../../../../../design-system/primitives/Box';
import './AspectRatioControl.css';

const AspectRatioControl = ({ options }: { options: SegmentOption[] }) => {
  const [w, setW] = useState(16);
  const [h, setH] = useState(9);
  return (
    <Box>
      <SegmentedControl options={options} value="custom" onChange={() => undefined} />
      <Stepper ariaLabel="Ratio width" min={1} step={1} value={w} onChange={setW} />
      <Stepper ariaLabel="Ratio height" min={1} step={1} value={h} onChange={setH} />
    </Box>
  );
};

export { AspectRatioControl };
`;

const ALERT_CSS = `.alert-banner {
  background: var(--c-gold-soft);
  border-left: var(--border-width-thick) solid var(--c-gold);
}
`;

const TABLE_TEST = `/* @layer tests @kind test */
import { buildSchema } from '../../apps/web/src/ui/design-system/data/schema/build-schema';
import * as columnOps from '../../apps/web/src/ui/design-system/data/table/column-ops';

const schema = buildSchema([]);
const ops = columnOps;
const later = () => import('../../apps/web/src/ui/design-system/composites/DataTable');

export { schema, ops, later };
`;

const TSCONFIG = `{
  "compilerOptions": {
    "paths": {
      "@app/*": ["./apps/web/src/*"],
      "@ds/*": ["./apps/web/src/ui/design-system/*"]
    }
  }
}
`;

const COPY_FILES = {
  [`${COPY}/primitives/index.ts`]: "export { Badge } from './Badge';\n",
  [`${COPY}/primitives/Badge/index.ts`]: "export { Badge } from './Badge';\n",
  [`${COPY}/primitives/Badge/Badge.css`]: '.badge--success { color: var(--c-gold); }\n',
  [`${COPY}/tokens/index.css`]: ':root { --c-gold: #c8a84e; }\n',
};

const ROTP = {
  'package.json': { name: 'relic-of-the-past', version: '0.20.7' },
  'tsconfig.json': TSCONFIG,
  ...COPY_FILES,
  'apps/web/src/main.tsx': "/* @layer renderer-app @kind entry */\nimport '@ds/tokens/index.css';\nimport { Box } from '@ds/primitives';\n\nexport const Root = () => <Box />;\n",
  [`${VIEWS}/compounds/ControllerStatusBadge/ControllerStatusBadge.tsx`]: STATUS_BADGE,
  [`${VIEWS}/views/ProfileHub/sub-components/AspectRatioControl.tsx`]: ASPECT_RATIO,
  [`${VIEWS}/compounds/AlertBanner/AlertBanner.css`]: ALERT_CSS,
  'apps/sanctuary/src/views/SavedViewsMenu.tsx': "import { useAnchorMenu } from '@ds/composites/FilterBar/behavior/use-anchor-menu';\n\nexport const menu = useAnchorMenu;\n",
  'tests/design-system/table-state.keep.test.ts': TABLE_TEST,
};

const made = [];

const repo = (files, { tessera = true } = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-tessera-copy-'));
  made.push(root);
  for (const [file, value] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), typeof value === 'string' ? value : JSON.stringify(value, null, 2));
  }
  if (tessera) {
    mkdirSync(join(root, 'node_modules/@drizztdourden08'), { recursive: true });
    symlinkSync(TESSERA_DIR, join(root, 'node_modules/@drizztdourden08/tessera'), 'junction');
  }
  return root;
};

const read = (root, file) => readFileSync(join(root, file), 'utf8');

const todosOf = (run) => run.applied.flatMap((entry) => entry.todos.map((todo) => ({ ...todo, id: entry.id })));

const convert = (root) => tesseraCopyStep({ rootDir: root, copy: COPY, aliases: ['@ds'] });

const converted = { root: '', run: null };

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('brock migrate --tessera-from-copy on files from Relic of the Past', () => {
  beforeAll(() => {
    converted.root = repo(ROTP);
    made.splice(made.indexOf(converted.root), 1);
    converted.run = convert(converted.root);
  }, 60000);

  afterAll(() => rmSync(converted.root, { recursive: true, force: true }));

  it('turns the copy\'s Badge into Status, never into Tessera\'s Badge', () => {
    const { root } = converted;
    const source = read(root, `${VIEWS}/compounds/ControllerStatusBadge/ControllerStatusBadge.tsx`);
    expect(source).toContain("import { Status } from '@drizztdourden08/tessera/primitives';");
    expect(source).toContain("<Status tone={status === 'ready' ? 'success' : 'warning'}>{LABEL[status]}</Status>");
    expect(source).not.toMatch(/\bBadge\b(?!Props)/);
  }, 60000);

  it('turns the copy\'s Stepper into NumberInput with side buttons, never into Tessera\'s Stepper', () => {
    const { root, run } = converted;
    const source = read(root, `${VIEWS}/views/ProfileHub/sub-components/AspectRatioControl.tsx`);
    expect(source).toContain('<NumberInput buttons="sides" aria-label="Ratio width" min={1} step={1} value={w} onChange={setW} />');
    expect(source).toContain('<NumberInput buttons="sides" aria-label="Ratio height"');
    expect(source).not.toMatch(/\b(?:Number)?Stepper\b/);
    expect(source.match(/from '@drizztdourden08\/tessera\/primitives';/g)).toHaveLength(2);
    expect(source).toContain("import './AspectRatioControl.css';");
    expect(todosOf(run).filter(({ file }) => file.endsWith('AspectRatioControl.tsx'))).toEqual([]);
  }, 60000);

  it('replays the token renames over the app stylesheets and leaves the copy alone', () => {
    const { root } = converted;
    expect(read(root, `${VIEWS}/compounds/AlertBanner/AlertBanner.css`)).toContain('solid var(--c-primary);');
    for (const [file, text] of Object.entries(COPY_FILES)) expect(read(root, file)).toBe(text);
  }, 60000);

  it('points the tokens at Tessera and leaves a to-do for what cannot move by itself', () => {
    const { root, run } = converted;
    const todos = todosOf(run);
    expect(read(root, 'apps/web/src/main.tsx')).toContain("import '@drizztdourden08/tessera/tokens.css';\nimport { Box } from '@drizztdourden08/tessera/primitives';");
    const at = (file) => todos.filter((todo) => todo.file === file).map(({ line, message }) => `${line}: ${message}`);
    expect(at('apps/web/src/main.tsx')).toEqual([expect.stringMatching(/^2: now imports Tessera's tokens\.css/)]);
    expect(at('apps/sanctuary/src/views/SavedViewsMenu.tsx')).toEqual([expect.stringMatching(/^1: Tessera .* exports no useAnchorMenu/)]);
    expect(at('tests/design-system/table-state.keep.test.ts')).toEqual([
      expect.stringMatching(/^3: A namespace import of the copy \(data\/table\/column-ops\) is left alone/),
      expect.stringMatching(/^7: names composites\/DataTable of the copy in a string/),
    ]);
    expect(at('tsconfig.json')).toEqual([expect.stringMatching(/^5: maps @ds to the copy/)]);
    expect(at(COPY)).toEqual([expect.stringMatching(/^null: the copy of the design system/)]);
  }, 60000);
});

describe('brock migrate --tessera-from-copy: runs again', () => {
  it('pins brock.tessera and changes nothing on a second run', () => {
    const root = repo(ROTP);
    const first = convert(root);
    expect(first.pinned).toBe(TESSERA_VERSION);
    expect(first.range).toMatchObject({ from: '0.3.0', to: TESSERA_VERSION });
    const files = Object.keys(ROTP).filter((file) => file !== 'package.json');
    const before = files.map((file) => read(root, file));
    const second = convert(root);
    expect(files.map((file) => read(root, file))).toEqual(before);
    expect(second.applied.flatMap((entry) => entry.touched)).toEqual([]);
  }, 120000);

  it('leaves a file that imports Tessera already for a person', () => {
    const mixed = "import { Status } from '@drizztdourden08/tessera/primitives';\nimport { Stepper } from '@ds/primitives';\n\nexport const parts = [Status, Stepper];\n";
    const root = repo({ ...ROTP, 'apps/web/src/mixed.tsx': mixed });
    const todos = todosOf(convert(root)).filter(({ file }) => file === 'apps/web/src/mixed.tsx');
    expect(read(root, 'apps/web/src/mixed.tsx')).toBe(mixed);
    expect(todos).toEqual([expect.objectContaining({ line: 2, message: expect.stringContaining('imports Tessera already') })]);
  }, 60000);
});

describe('brock migrate --tessera-from-copy: refusals', () => {
  it('needs Tessera installed, and the copy folder', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const bare = repo(ROTP, { tessera: false });
    expect(await runMigrate({ rootDir: bare, tesseraFromCopy: COPY, aliases: ['@ds'] })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('@drizztdourden08/tessera is not installed'));
    expect(read(bare, `${VIEWS}/compounds/ControllerStatusBadge/ControllerStatusBadge.tsx`)).toBe(STATUS_BADGE);
    expect(await runMigrate({ rootDir: bare, tesseraFromCopy: 'apps/web/src/missing' })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('does not exist'));
    expect(await runMigrate({ rootDir: bare, tesseraFromCopy: COPY, tesseraFrom: '0.3.0' })).toBe(1);
  });

  it('runs without brock.version, since it replays only Tessera', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const root = repo(ROTP);
    expect(await runMigrate({ rootDir: root, tesseraFromCopy: COPY, aliases: ['@ds'] })).toBe(0);
    expect(JSON.parse(read(root, 'package.json')).brock).toEqual({ tessera: TESSERA_VERSION });
  }, 60000);
});
