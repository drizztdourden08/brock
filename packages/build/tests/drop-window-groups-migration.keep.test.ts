/* @layer tooling-scripts @kind test */
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { afterEach, describe, expect, it } from 'vitest';

const VIEWS = {
  'profile:main': {
    widgetLayout: {
      v: 2,
      popped: [{ id: 'logs', snap: true, group: '2' }],
      poppedMemory: { notes: { id: 'notes', sync: true, group: '1' } },
    },
  },
  other: { kept: true },
};

const made: string[] = [];
const dropGroups = () => selectMigrations(collectMigrations([]), { from: '0.12.0', to: '0.13.0' }).filter((m) => m.file.endsWith('drop-window-groups.mjs'));

const appWithData = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-window-groups-'));
  made.push(root);
  writeFileSync(join(root, 'package.json'), '{"name":"x"}');
  mkdirSync(join(root, '.user-data', 'Data', 'config'), { recursive: true });
  writeFileSync(join(root, '.user-data', 'Data', 'config', 'window-group.json'), '{ "group": "1" }');
  writeFileSync(join(root, '.user-data', 'Data', 'ui-views.json'), JSON.stringify(VIEWS, null, 2));
  return root;
};

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('drop-window-groups', () => {
  it('removes the main window group file and the group of each saved popped widget, once', async () => {
    const root = appWithData();
    const run = await runMigrations(root, dropGroups());
    expect(run.applied[0]?.touched).toEqual(['.user-data/Data/config/window-group.json', '.user-data/Data/ui-views.json']);
    expect(existsSync(join(root, '.user-data', 'Data', 'config', 'window-group.json'))).toBe(false);
    const views = JSON.parse(readFileSync(join(root, '.user-data', 'Data', 'ui-views.json'), 'utf8')) as typeof VIEWS;
    expect(views['profile:main'].widgetLayout.popped).toEqual([{ id: 'logs', snap: true }]);
    expect(views['profile:main'].widgetLayout.poppedMemory).toEqual({ notes: { id: 'notes', sync: true } });
    expect(views.other).toEqual({ kept: true });
    const again = await runMigrations(root, dropGroups());
    expect(again.applied[0]?.touched).toEqual([]);
  });
});
