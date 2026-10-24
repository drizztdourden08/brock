/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.80.0/main-context-window-show.mjs';

const run = (source) => migration.apply({ path: 'tests/ctx.test.ts', source });

const OLD = [
  "import type { MainContext } from '@drizztdourden08/brock-electron/main';",
  'const ctx: Partial<MainContext> = {',
  "  flags: { flags: [], isAutomationLaunch: () => false, isHeadlessLaunch: () => false, flagValue: () => null, hasFlag: () => false },",
  '  window: () => null,',
  '  log: vi.fn(),',
  '};',
  '',
].join('\n');

describe('the main-context-window-show migration', () => {
  it('leaves a to-do at a flags object without isBackgroundLaunch and at a window without show, and edits nothing', () => {
    const { source, todos } = run(OLD);
    expect(source).toBe(OLD);
    expect(todos.map((todo) => todo.line).sort()).toEqual([3, 4]);
    expect(todos.some((todo) => /isBackgroundLaunch/.test(todo.message))).toBe(true);
    expect(todos.some((todo) => /show\(\)/.test(todo.message))).toBe(true);
  });

  it('is idempotent: a second run over the same source finds the same to-dos', () => {
    const first = run(OLD);
    expect(run(first.source).todos).toEqual(first.todos);
  });

  it('leaves nothing for objects that already have the new members', () => {
    const source = [
      "import type { MainContext } from '@drizztdourden08/brock-electron/main';",
      'const flags = { isAutomationLaunch: () => false, isBackgroundLaunch: () => false, isHeadlessLaunch: () => false };',
      'const window = { window: Object.assign(() => null, { show: () => Promise.resolve() }) } as MainContext;',
      '',
    ].join('\n');
    expect(run(source).todos).toEqual([]);
  });

  it('checks each flags object on its own', () => {
    const source = [
      'const a = { isBackgroundLaunch: () => false, isHeadlessLaunch: () => false };',
      'const b = { isHeadlessLaunch: () => true };',
      '',
    ].join('\n');
    expect(run(source).todos.map((todo) => todo.line)).toEqual([2]);
  });

  it('ignores a window option in a file that has no MainContext', () => {
    expect(run("const options = { window: () => other };\n").todos).toEqual([]);
  });
});
