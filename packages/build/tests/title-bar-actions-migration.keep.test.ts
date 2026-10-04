/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const release = () => selectMigrations(collectMigrations([]), { from: '0.6.1', to: '0.7.0' });

const UPDATER = [
  "import type { RendererModule } from '@drizztdourden08/brock-react';",
  "import { UpdateBadge, UPDATER_MENU } from '@drizztdourden08/brock-updater/renderer';",
  "import { SearchButton } from '@drizztdourden08/brock-react';",
  '',
  'export const shell: RendererModule = {',
  "  id: 'shell',",
  '  menu: UPDATER_MENU,',
  '  titleBar: [SearchButton, UpdateBadge],',
  '};',
  '',
].join('\n');

const STANDARD_ONLY = [
  "import { BugReportButton, useBrock } from '@drizztdourden08/brock-react';",
  '',
  "export const tools = { id: 'tools', titleBar: [BugReportButton] };",
  'export const read = useBrock;',
  '',
].join('\n');

const CUSTOM = [
  "import type { RendererModule, TitleBarSlot } from '@drizztdourden08/brock-react';",
  "import { SyncPill } from './SyncPill';",
  '',
  "export const sync: RendererModule = { id: 'sync', titleBar: [SyncPill] };",
  'SyncPill.conditional = true;',
  'export type Slot = TitleBarSlot;',
  '',
].join('\n');

const WINDOW = "export const product = { window: { titleBar: { controls: { pin: false } } } };\n";

const FILES: Readonly<Record<string, string>> = {
  'package.json': '{"name":"x"}',
  '.gitignore': 'node_modules/\npublic/logos/icon-256.png\n',
  'src/updater.ts': UPDATER,
  'src/tools.ts': STANDARD_ONLY,
  'src/sync.ts': CUSTOM,
  'brock.config.ts': WINDOW,
};

const roots: string[] = [];

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

const sample = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-title-bar-'));
  roots.push(root);
  for (const [file, text] of Object.entries(FILES)) {
    const path = join(root, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  return root;
};

const read = (root: string, file: string): string => readFileSync(join(root, file), 'utf8');

describe('the 0.7.0 title bar migrations', () => {
  it('ship in the 0.7.0 folder', () => {
    expect(release().map((m) => `${m.version} ${m.file.split(/[\\/]/).pop() ?? ''}`)).toEqual([
      '0.7.0 gitignore-title-bar-logos.mjs', '0.7.0 title-bar-actions.mjs',
    ]);
  });

  it('turns the updater badge into its action hook and drops the standard search button', async () => {
    const root = sample();
    await runMigrations(root, release());
    expect(read(root, 'src/updater.ts')).toBe([
      "import type { RendererModule } from '@drizztdourden08/brock-react';",
      "import { useUpdateAction, UPDATER_MENU } from '@drizztdourden08/brock-updater/renderer';",
      '',
      'export const shell: RendererModule = {',
      "  id: 'shell',",
      '  menu: UPDATER_MENU,',
      '  titleBarActions: [useUpdateAction],',
      '};',
      '',
    ].join('\n'));
  });

  it('drops a slot list that only held standard buttons, with the import it leaves unused', async () => {
    const root = sample();
    await runMigrations(root, release());
    expect(read(root, 'src/tools.ts')).toBe([
      "import { useBrock } from '@drizztdourden08/brock-react';",
      '',
      "export const tools = { id: 'tools' };",
      'export const read = useBrock;',
      '',
    ].join('\n'));
  });

  it('leaves a custom slot in place with to-dos naming the actions API, and no window.titleBar change', async () => {
    const root = sample();
    const run = await runMigrations(root, release());
    expect(read(root, 'src/sync.ts')).toBe(CUSTOM);
    expect(read(root, 'brock.config.ts')).toBe(WINDOW);
    const todos = run.todos.filter((todo) => todo.file === 'src/sync.ts');
    expect(todos.map(({ line }) => line).sort()).toEqual([1, 4, 5, 6]);
    expect(todos.find((todo) => todo.line === 4)?.message).toContain('WindowTitleBarAction');
  });

  it('ignores the 32 and 24 px title bar logos beside icon-256.png', async () => {
    const root = sample();
    await runMigrations(root, release());
    expect(read(root, '.gitignore')).toBe('node_modules/\npublic/logos/icon-256.png\npublic/logos/icon-32.png\npublic/logos/icon-24.png\n');
  });

  it('changes nothing on a second run', async () => {
    const root = sample();
    await runMigrations(root, release());
    const again = await runMigrations(root, release());
    expect(again.applied.flatMap((m) => m.touched)).toEqual([]);
  });
});
