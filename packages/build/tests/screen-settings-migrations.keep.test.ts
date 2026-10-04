/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const release = () => selectMigrations(collectMigrations([]), { from: '0.9.0', to: '0.10.0' });

const PAGE = [
  "import type { Section } from '@drizztdourden08/brock-react';",
  '',
  'const sections: Section[] = [',
  "  { id: 'window', title: 'Window', items: [",
  "    { key: 'fullscreen', label: 'Start fullscreen', description: 'Open in fullscreen.' },",
  "    { key: 'mode', label: 'Mode', hint: 'Pick a mode.', noDescription: true },",
  "    { key: 'scale', label: 'Scale' },",
  '  ] },',
  '];',
  '',
  'export default sections;',
  '',
].join('\n');

const TAB = [
  "import { SettingsSection } from '@drizztdourden08/tessera/composites';",
  '',
  'const Tab = (props: { on: boolean; set: (on: boolean) => void }) => (',
  '  <SettingsSection',
  "    rows={[{ id: 'sync', title: 'Sync', input: { kind: 'toggle', value: props.on, onChange: props.set } }]}",
  '  />',
  ');',
  '',
  'export { Tab };',
  '',
].join('\n');

const SCREEN = [
  "import { defineScreen } from '@drizztdourden08/brock-react';",
  '',
  "const saves = defineScreen({ id: 'saves', title: 'Saves', render: () => null });",
  "const maps = defineScreen({ id: 'maps', title: 'Maps', icon: null, render: () => null });",
  '',
  'export { maps, saves };',
  '',
].join('\n');

const FILES: Readonly<Record<string, string>> = { 'screens/game/general.settings.ts': PAGE, 'SyncTab.tsx': TAB, 'saves.tsx': SCREEN };

const migrateSample = async () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-settings-rows-'));
  try {
    writeFileSync(join(root, 'package.json'), '{"name":"x"}');
    mkdirSync(join(root, 'src', 'screens', 'game'), { recursive: true });
    Object.entries(FILES).forEach(([file, text]) => writeFileSync(join(root, 'src', file), text));
    const run = await runMigrations(root, release());
    return { run, page: readFileSync(join(root, 'src', 'screens', 'game', 'general.settings.ts'), 'utf8') };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

describe('the 0.10.0 settings row and screen migrations', () => {
  it('ship in the 0.10.0 folder', () => {
    expect(release().map((m) => `${m.version} ${m.file.split(/[\\/]/).pop() ?? ''}`)).toEqual(['0.10.0 screen-icons.mjs', '0.10.0 settings-row-hints.mjs']);
  });

  it('leaves a to-do on each row without a hint or a description, naming the fields, and changes no file', async () => {
    const { run, page } = await migrateSample();
    expect(page).toBe(PAGE);
    const rows = run.todos.filter((todo) => todo.migration === 'settings-row-hints');
    expect(rows.map(({ file, line }) => `${file}:${line}`)).toEqual(['src/SyncTab.tsx:5', 'src/screens/game/general.settings.ts:5', 'src/screens/game/general.settings.ts:7']);
    const [tab, fullscreen, scale] = rows.map(({ message }) => message);
    expect(tab).toContain('"Sync" has no hint and no description (or noDescription: true)');
    expect(fullscreen).toContain('"Start fullscreen" has no hint. Add hint.');
    expect(scale).toContain('Add hint and description (or noDescription: true)');
  });

  it('leaves a to-do on each screen defined without an icon', async () => {
    const { run } = await migrateSample();
    const screens = run.todos.filter((todo) => todo.migration === 'screen-icons');
    expect(screens.map(({ file, line }) => `${file}:${line}`)).toEqual(['src/saves.tsx:3']);
    expect(screens[0]?.message).toContain('defineScreen now needs icon');
  });
});
