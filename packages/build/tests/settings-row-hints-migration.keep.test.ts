/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
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

const roots: string[] = [];

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

const sample = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-settings-rows-'));
  roots.push(root);
  const files: Record<string, string> = { 'package.json': '{"name":"x"}', 'src/screens/game/general.settings.ts': PAGE, 'src/SyncTab.tsx': TAB };
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), text);
  }
  return root;
};

describe('the 0.10.0 settings row migration', () => {
  it('ships in the 0.10.0 folder', () => {
    expect(release().map((m) => `${m.version} ${m.file.split(/[\\/]/).pop() ?? ''}`)).toEqual(['0.10.0 settings-row-hints.mjs']);
  });

  it('leaves a to-do on each row without a hint or a description, naming the fields, and changes no file', async () => {
    const root = sample();
    const run = await runMigrations(root, release());
    expect(readFileSync(join(root, 'src/screens/game/general.settings.ts'), 'utf8')).toBe(PAGE);
    expect(run.todos.map(({ file, line }) => `${file}:${line}`)).toEqual(['src/SyncTab.tsx:5', 'src/screens/game/general.settings.ts:5', 'src/screens/game/general.settings.ts:7']);
    const [tab, fullscreen, scale] = run.todos.map(({ message }) => message);
    expect(tab).toContain('"Sync" has no hint and no description (or noDescription: true)');
    expect(fullscreen).toContain('"Start fullscreen" has no hint. Add hint.');
    expect(scale).toContain('Add hint and description (or noDescription: true)');
  });
});
