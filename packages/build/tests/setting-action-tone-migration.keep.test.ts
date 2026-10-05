/* @layer tooling-scripts @kind test */
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { afterEach, describe, expect, it } from 'vitest';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const made: string[] = [];

const steps = () => selectMigrations(collectMigrations([]), { from: '0.25.0', to: null }).filter((m) => m.file.replace(/\\/g, '/').endsWith('0.26.0/setting-action-tone.mjs'));

const migrate = async (files: Record<string, string>) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-action-tone-'));
  made.push(root);
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'tone' }));
  mkdirSync(join(root, 'src'));
  Object.entries(files).forEach(([name, text]) => writeFileSync(join(root, 'src', name), text));
  const run = await runMigrations(root, steps());
  return { root, run, read: (name: string) => readFileSync(join(root, 'src', name), 'utf8') };
};

const SETTINGS = [
  "import type { Section } from '@drizztdourden08/brock-react';",
  'const sections: Section[] = [{',
  "  id: 'data', title: 'Data', items: [{",
  "    key: 'cache', label: 'Cache', description: 'Kept files.', hint: 'Clear it to free space.',",
  '    actions: [',
  "      { id: 'clear', label: 'Clear', variant: 'danger', confirm: { title: 'Clear?', message: 'Gone.', variant: 'danger' }, onSelect: clear },",
  "      ...kinds.map((kind) => ({ id: kind, label: kind, 'variant': 'secondary', onSelect: () => clean(kind) })),",
  '    ],',
  '  }],',
  '}];',
  '',
].join('\n');

const TYPED = [
  "import type { SettingAction as Action } from '@drizztdourden08/brock-react';",
  "const wipe = (): Action => ({ label: 'Wipe', variant: 'danger', onSelect: run });",
  "const list: Action[] = [{ label: 'One', variant, onSelect: run }];",
  "const kept = { ...base, variant: 'danger' } satisfies Action;",
  "const both: Action = { label: 'Both', tone: 'danger', variant: 'danger', onSelect: run };",
  '',
].join('\n');

const OTHERS = [
  "export const A = () => <SettingActions actions={[{ label: 'Go', variant: 'primary', onSelect: go }]} />;",
  'export const B = () => <Button variant="danger" onClick={go}>B</Button>;',
  "toast('Saved', { variant: 'success' });",
  "const loose = { label: 'Loose', variant: 'danger', onSelect: go };",
  '',
].join('\n');

afterEach(() => {
  made.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

describe('setting-action-tone (0.26.0)', () => {
  it('runs for an app on Brock 0.25 only', () => {
    expect(steps()).toHaveLength(1);
    expect(selectMigrations(collectMigrations([]), { from: '0.26.0', to: null }).some((m) => m.version === '0.26.0')).toBe(false);
  });

  it('turns variant into tone in an actions list, mapped ones too, and leaves the confirm dialog variant', async () => {
    const { read } = await migrate({ 'data.settings.ts': SETTINGS });
    const after = read('data.settings.ts');
    expect(after).toContain("{ id: 'clear', label: 'Clear', tone: 'danger', confirm: { title: 'Clear?', message: 'Gone.', variant: 'danger' }, onSelect: clear },");
    expect(after).toContain("({ id: kind, label: kind, 'tone': 'secondary', onSelect: () => clean(kind) })");
  });

  it('turns variant into tone in objects typed SettingAction, and makes tone beside variant a to-do', async () => {
    const { run, read } = await migrate({ 'typed.ts': TYPED });
    expect(read('typed.ts')).toBe([
      "import type { SettingAction as Action } from '@drizztdourden08/brock-react';",
      "const wipe = (): Action => ({ label: 'Wipe', tone: 'danger', onSelect: run });",
      "const list: Action[] = [{ label: 'One', tone: variant, onSelect: run }];",
      "const kept = { ...base, tone: 'danger' } satisfies Action;",
      "const both: Action = { label: 'Both', tone: 'danger', variant: 'danger', onSelect: run };",
      '',
    ].join('\n'));
    expect(run.todos.map((todo) => `${todo.line} ${todo.message}`)).toEqual([expect.stringMatching(/^5 .*sets both tone and variant/)]);
  });

  it('turns a JSX actions list, leaves a Button and a toast alone, and makes a lone action-like object a to-do', async () => {
    const { run, read } = await migrate({ 'others.tsx': OTHERS });
    const after = read('others.tsx');
    expect(after).toContain("actions={[{ label: 'Go', tone: 'primary', onSelect: go }]}");
    expect(after).toContain('<Button variant="danger" onClick={go}>B</Button>');
    expect(after).toContain("toast('Saved', { variant: 'success' });");
    expect(after).toContain("const loose = { label: 'Loose', variant: 'danger', onSelect: go };");
    expect(run.todos.map((todo) => `${todo.line} ${todo.message}`)).toEqual([expect.stringMatching(/^4 .*if it is a SettingAction, write tone/)]);
  });

  it('changes nothing on a second run', async () => {
    const { root, read } = await migrate({ 'data.settings.ts': SETTINGS, 'typed.ts': TYPED, 'others.tsx': OTHERS });
    const first = ['data.settings.ts', 'typed.ts', 'others.tsx'].map(read);
    const again = await runMigrations(root, steps());
    expect(['data.settings.ts', 'typed.ts', 'others.tsx'].map(read)).toEqual(first);
    expect(again.applied[0]?.touched).toEqual([]);
  });
});
