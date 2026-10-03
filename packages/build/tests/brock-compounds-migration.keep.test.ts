/* @layer tooling-scripts @kind test */
import { describe, expect, it, onTestFinished } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const compounds = () => selectMigrations(collectMigrations([]), { from: '0.3.0', to: '0.4.0' }).filter((m) => m.file.endsWith('brock-compounds.mjs'));

const ABOUT = [
  "import { useBrock } from '@drizztdourden08/brock-react';",
  "import { AboutPanel, InfoScreen } from '@drizztdourden08/tessera/composites';",
  "import type { AboutPanelRow, ReleaseNotesPanelProps } from '@drizztdourden08/tessera';",
  '',
  'export const rows: AboutPanelRow[] = [];',
  '',
].join('\n');

const CALIBRATION = [
  "import { CalibrationPanel as Panel, StickPlot } from \"@drizztdourden08/tessera/composites\";",
  "import { ReleaseNotesPanel } from '@drizztdourden08/tessera/composites';",
  '',
  'export const parts = [Panel, StickPlot, ReleaseNotesPanel];',
  '',
].join('\n');

const PROFILES = [
  "import { InlineCreateForm, ProfilePicker } from '@drizztdourden08/tessera/composites';",
  "import type { ProfilePickerItem } from '@drizztdourden08/tessera/composites';",
  '',
  'export const parts = [InlineCreateForm, ProfilePicker];',
  'export type Item = ProfilePickerItem;',
  '',
].join('\n');

const FILES: Readonly<Record<string, string>> = {
  'package.json': '{"name":"x"}',
  'src/about.tsx': ABOUT,
  'src/calibration.tsx': CALIBRATION,
  'src/profiles.tsx': PROFILES,
};

const sample = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-compounds-'));
  onTestFinished(() => rmSync(root, { recursive: true, force: true }));
  Object.entries(FILES).forEach(([file, text]) => {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), text);
  });
  return root;
};

const read = (root: string, file: string): string => readFileSync(join(root, 'src', file), 'utf8');

describe('the 0.4.0 brock-compounds migration', () => {
  it('ships in the 0.4.0 folder', () => {
    expect(compounds().map((m) => m.version)).toEqual(['0.4.0']);
  });

  it('moves the AboutPanel and ReleaseNotesPanel imports to brock-react, merging with an import already there', async () => {
    const root = sample();
    await runMigrations(root, compounds());
    expect(read(root, 'about.tsx')).toBe([
      "import { useBrock, AboutPanel } from '@drizztdourden08/brock-react';",
      "import { InfoScreen } from '@drizztdourden08/tessera/composites';",
      "import type { AboutPanelRow, ReleaseNotesPanelProps } from '@drizztdourden08/brock-react';",
      '',
      'export const rows: AboutPanelRow[] = [];',
      '',
    ].join('\n'));
  });

  it('moves CalibrationPanel to the input module renderer and keeps its alias and the quote style', async () => {
    const root = sample();
    await runMigrations(root, compounds());
    expect(read(root, 'calibration.tsx')).toBe([
      'import { StickPlot } from "@drizztdourden08/tessera/composites";',
      'import { CalibrationPanel as Panel } from "@drizztdourden08/brock-input/renderer";',
      "import { ReleaseNotesPanel } from '@drizztdourden08/brock-react';",
      '',
      'export const parts = [Panel, StickPlot, ReleaseNotesPanel];',
      '',
    ].join('\n'));
  });

  it('leaves ProfilePicker in place with a to-do that points to ProfilesPanel', async () => {
    const root = sample();
    const run = await runMigrations(root, compounds());
    expect(read(root, 'profiles.tsx')).toBe(PROFILES);
    expect(run.todos.map(({ file, line }) => `${file}:${line}`)).toEqual(['src/profiles.tsx:1', 'src/profiles.tsx:2']);
    expect(run.todos[0]?.message).toContain('ProfilesPanel from @drizztdourden08/brock-react');
  });

  it('changes nothing on a second run', async () => {
    const root = sample();
    await runMigrations(root, compounds());
    const again = await runMigrations(root, compounds());
    expect(again.applied.flatMap((m) => m.touched)).toEqual([]);
  });
});
