/* @layer tooling-scripts @kind test */
import { tesseraRenamesStep } from '../src/upgrade/tessera/tessera-renames-step.mjs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const RELEASE = {
  version: 'next',
  props: {
    'SettingsRowAction.onClick': 'onSelect',
    'UtilityScreenAction.variant': 'tone',
    'StageScreenDone.onClick': 'removed; the done step closes itself (see MIGRATION.md)',
  },
};

const COMPOSITES = [
  "export interface SettingsRowAction { id: string; label: string; onSelect: () => void; tone?: 'danger' }",
  'export interface SettingsRowProps { title: string; actions?: readonly SettingsRowAction[] }',
  'export const SettingsRow = (props: SettingsRowProps): null => null;',
  "export interface UtilityScreenAction { label: string; onSelect: () => void; tone?: 'primary' | 'danger' }",
  'export interface StageScreenDone { label: string }',
  'export const addAction = (action: SettingsRowAction): void => undefined;',
  '',
].join('\n');

const VIEW = [
  "import { addAction, SettingsRow, type SettingsRowAction, type StageScreenDone, type UtilityScreenAction } from '@drizztdourden08/tessera/composites';",
  'const go = (): void => undefined;',
  'interface LocalAction { label: string; onClick: () => void }',
  "export const made = (): SettingsRowAction => ({ id: 'a', label: 'A', onClick: go });",
  "addAction({ id: 'b', label: 'B', onClick() { go(); } });",
  "export const list: SettingsRowAction[] = [{ id: 'c', label: 'C', onClick: go }];",
  "export const View = () => <SettingsRow title=\"T\" actions={[{ id: 'd', label: 'D', onClick: go }]} />;",
  'const onClick = go;',
  "export const short = (): SettingsRowAction => ({ id: 'e', label: 'E', onClick });",
  "export const utility: UtilityScreenAction = { label: 'U', onSelect: go, variant: 'danger' };",
  "export const done: StageScreenDone = { label: 'Done', onClick: go };",
  "export const local: LocalAction = { label: 'L', onClick: go };",
  'export const loose = { onClick: go };',
  "export const button = <button type=\"button\" onClick={go}>x</button>;",
  '',
].join('\n');

const TESSERA = join('node_modules', '@drizztdourden08', 'tessera');
const TESSERA_PACKAGE = { name: '@drizztdourden08/tessera', version: '0.3.0', exports: { './composites': './src/composites.ts' } };
const state = { root: '', first: null, second: null, after: '', again: '' };
const VIEW_FILE = ['src', 'view.tsx'];

const writeApp = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-typed-props-'));
  for (const dir of ['src', join(TESSERA, 'src')]) mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(join(root, 'package.json'), '{ "name": "app" }\n');
  writeFileSync(join(root, TESSERA, 'package.json'), JSON.stringify(TESSERA_PACKAGE));
  writeFileSync(join(root, TESSERA, 'RENAMES.json'), JSON.stringify({ releases: [RELEASE] }));
  writeFileSync(join(root, TESSERA, 'src', 'composites.ts'), COMPOSITES);
  writeFileSync(join(root, ...VIEW_FILE), VIEW);
  return root;
};

const lines = (run) => run.applied.flatMap(({ todos }) => todos.map(({ file, line, message }) => `${file}:${line} ${message}`));

const replayed = (root) => {
  const run = tesseraRenamesStep({ rootDir: root });
  return { run, text: readFileSync(join(root, ...VIEW_FILE), 'utf8') };
};

beforeAll(() => {
  state.root = writeApp();
  ({ run: state.first, text: state.after } = replayed(state.root));
  ({ run: state.second, text: state.again } = replayed(state.root));
});

afterAll(() => rmSync(state.root, { recursive: true, force: true }));

describe('the Tessera prop renames on object literals typed by their context', () => {
  it('renames a prop of an object returned where the return type is the Tessera type', () => {
    expect(state.after).toContain("export const made = (): SettingsRowAction => ({ id: 'a', label: 'A', onSelect: go });");
  });

  it('renames a method of an object passed as an argument typed with the Tessera type', () => {
    expect(state.after).toContain("addAction({ id: 'b', label: 'B', onSelect() { go(); } });");
  });

  it('renames a prop of an object inside an array of the Tessera type', () => {
    expect(state.after).toContain("export const list: SettingsRowAction[] = [{ id: 'c', label: 'C', onSelect: go }];");
  });

  it('renames a prop of an object inside a JSX prop value of a Tessera component', () => {
    expect(state.after).toContain("<SettingsRow title=\"T\" actions={[{ id: 'd', label: 'D', onSelect: go }]} />");
  });

  it('keeps the value of a shorthand prop, and renames a prop of an annotated object', () => {
    expect(state.after).toContain("({ id: 'e', label: 'E', onSelect: onClick })");
    expect(state.after).toContain("export const utility: UtilityScreenAction = { label: 'U', onSelect: go, tone: 'danger' };");
  });

  it('leaves other objects and JSX alone, and a note is a to-do on the prop', () => {
    expect(state.after).toContain("export const local: LocalAction = { label: 'L', onClick: go };");
    expect(state.after).toContain('export const loose = { onClick: go };');
    expect(state.after).toContain('<button type="button" onClick={go}>x</button>');
    expect(state.after).toContain("export const done: StageScreenDone = { label: 'Done', onClick: go };");
    expect(lines(state.first)).toEqual([expect.stringMatching(/^src\/view\.tsx:11 .*prop StageScreenDone\.onClick is now "removed; the done step closes itself/)]);
  });

  it('changes nothing on a second replay', () => {
    expect(state.again).toBe(state.after);
    expect(state.second.applied[0].touched).toEqual([]);
    expect(lines(state.second)).toEqual(lines(state.first));
  });
});
