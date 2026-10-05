/* @layer tooling-scripts @kind test */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { tesseraRenamesStep } from '../src/upgrade/tessera/tessera-renames-step.mjs';
import { dirname, join } from 'node:path';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

const SEE = '(see MIGRATION.md section 197)';

const PROPS = {
  'CommandInput.onEnter': 'onSubmit',
  'CommandInput.aria-label': 'label',
  'CommandInput.aria-invalid': 'invalid',
  'CommandInput.name': `removed; keep the command in your form state ${SEE}`,
  'CommandInput.aria-*': `removed, every aria attribute but aria-describedby ${SEE}`,
  'CommandInput.on*': `removed, every DOM event handler but onKeyDown ${SEE}`,
  'CommandInput.*': `removed, every other HTML attribute ${SEE}`,
};

const COMPOSITES = [
  'export interface CommandInputProps {',
  '  onSubmit: (command: string) => boolean | void;',
  '  label?: string;',
  '  invalid?: boolean;',
  '  className?: string;',
  "  'aria-describedby'?: string;",
  '  onKeyDown?: (event: unknown) => void;',
  '}',
  'export const CommandInput = (props: CommandInputProps): null => null;',
  '',
].join('\n');

const VIEW = [
  "import { CommandInput, type CommandInputProps } from '@drizztdourden08/tessera/composites';",
  'const go = (): void => undefined;',
  'export const View = () => (',
  '  <CommandInput',
  '    key="k"',
  '    onEnter={go}',
  '    aria-label="Run"',
  '    aria-hidden',
  '    aria-describedby="help"',
  '    onFocus={go}',
  '    onKeyDown={go}',
  '    name="command"',
  '    accessKey="c"',
  '    className="wide"',
  '  />',
  ');',
  "export const props: CommandInputProps = { onSubmit: go, 'aria-label': 'Run', 'aria-hidden': true, 'aria-describedby': 'help', onFocus: go, onKeyDown: go, name: 'cmd' };",
  'export const loose = { onFocus: go, name: 1 };',
  'export const button = <button type="button" onFocus={go} aria-hidden>x</button>;',
  '',
].join('\n');

const TESSERA = 'node_modules/@drizztdourden08/tessera';
const VIEW_FILE = 'src/view.tsx';
const roots = [];

const appFiles = ({ release, types }) => ({
  'package.json': { name: 'app' },
  [`${TESSERA}/package.json`]: { name: '@drizztdourden08/tessera', version: '0.3.0', exports: types ? { './composites': './src/composites.ts' } : {} },
  [`${TESSERA}/RENAMES.json`]: { releases: [release] },
  ...(types ? { [`${TESSERA}/src/composites.ts`]: COMPOSITES } : {}),
  [VIEW_FILE]: VIEW,
});

const writeApp = (shape) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-wildcard-props-'));
  roots.push(root);
  for (const [path, content] of Object.entries(appFiles(shape))) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), typeof content === 'string' ? content : JSON.stringify(content));
  }
  return root;
};

const lines = (run) => run.applied.flatMap(({ todos }) => todos.map(({ line, message }) => `${line} ${message}`));

const replayed = (root) => {
  const run = tesseraRenamesStep({ rootDir: root });
  return { run, text: readFileSync(join(root, VIEW_FILE), 'utf8'), todos: lines(run) };
};

const under = (line, prop, key) => new RegExp(`^${line} Tessera main \\(next\\): the prop CommandInput\\.${prop} falls under CommandInput\\.${key.replace('*', '\\*')}, which is now "removed`);

afterAll(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});

describe('the Tessera props keys ending in *, read with the installed types', () => {
  const state = { first: null, second: null };

  beforeAll(() => {
    const root = writeApp({ release: { version: 'next', props: PROPS }, types: true });
    state.first = replayed(root);
    state.second = replayed(root);
  });

  it('lets an exact key win: its rename is written, on the JSX attribute and the typed object', () => {
    expect(state.first.text).toContain('    onSubmit={go}\n    label="Run"\n');
    expect(state.first.text).toContain("{ onSubmit: go, 'label': 'Run', 'aria-hidden': true");
  });

  it('makes a to-do through the longest matching wildcard, and never renames', () => {
    expect(state.first.todos).toEqual(expect.arrayContaining([
      expect.stringMatching(under(8, 'aria-hidden', 'aria-*')),
      expect.stringMatching(under(10, 'onFocus', 'on*')),
      expect.stringMatching(under(13, 'accessKey', '*')),
      expect.stringMatching(under(17, 'aria-hidden', 'aria-*')),
      expect.stringMatching(under(17, 'onFocus', 'on*')),
    ]));
    expect(state.first.text).toContain('    aria-hidden\n');
    expect(state.first.text).toContain('    onFocus={go}\n');
  });

  it('keeps an exact note as its own to-do, on the attribute and the typed object', () => {
    const named = state.first.todos.filter((todo) => todo.includes('CommandInput.name'));
    expect(named).toEqual([
      expect.stringMatching(/^12 Tessera main \(next\): the prop CommandInput\.name is now "removed; keep the command/),
      expect.stringMatching(/^17 Tessera main \(next\): the prop CommandInput\.name is now "removed; keep the command/),
    ]);
  });

  it('leaves alone the props the component still takes, key, other objects and plain JSX', () => {
    for (const prop of ['aria-describedby', 'onKeyDown', 'className', 'key', 'label', 'onSubmit']) {
      expect(state.first.todos.some((todo) => todo.includes(`CommandInput.${prop} `))).toBe(false);
    }
    expect(state.first.todos.every((todo) => /^(?:8|10|12|13|17) /.test(todo))).toBe(true);
    expect(state.first.todos).toHaveLength(7);
    expect(state.first.text).toContain('export const loose = { onFocus: go, name: 1 };');
  });

  it('changes nothing on a second replay and lists the same to-dos', () => {
    expect(state.second.text).toBe(state.first.text);
    expect(state.second.run.applied[0].touched).toEqual([]);
    expect(state.second.todos).toEqual(state.first.todos);
  });
});

describe('the Tessera props keys ending in *, when the checker cannot read the types', () => {
  it('reads a keep list from the release when it has one', () => {
    const keep = { CommandInput: ['onSubmit', 'label', 'className', 'aria-describedby', 'onKeyDown'] };
    const { todos, text } = replayed(writeApp({ release: { version: 'next', props: PROPS, keep }, types: false }));
    expect(text).toContain('    label="Run"\n');
    expect(todos).toEqual(expect.arrayContaining([expect.stringMatching(under(8, 'aria-hidden', 'aria-*')), expect.stringMatching(under(10, 'onFocus', 'on*'))]));
    expect(todos.some((todo) => /CommandInput\.(?:aria-describedby|onKeyDown|className) |could not read/.test(todo))).toBe(false);
  });

  it('makes every covered prop a to-do that says to check it, without a keep list', () => {
    const { todos } = replayed(writeApp({ release: { version: 'next', props: PROPS }, types: false }));
    const unsure = todos.filter((todo) => todo.includes('Brock could not read the props CommandInput still takes'));
    expect(unsure).toEqual(expect.arrayContaining([expect.stringMatching(/^9 .*CommandInput\.aria-describedby falls under CommandInput\.aria-\*/)]));
    expect(unsure).toHaveLength(6);
  });
});
