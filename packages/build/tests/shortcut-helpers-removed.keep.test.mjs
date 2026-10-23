/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.76.0/shortcut-helpers-removed.mjs';

const run = (source) => migration.apply({ path: 'src/hooks/useSaveKey.ts', source });

describe('the shortcut-helpers-removed migration', () => {
  it('turns each removed helper into a to-do and leaves the source alone', () => {
    const source = [
      "import { matchesShortcut, parseShortcut } from '@drizztdourden08/brock-react';",
      "import type { ParsedShortcut } from '@drizztdourden08/brock-react';",
      "const parsed: ParsedShortcut = parseShortcut('Mod+S');",
      "if (matchesShortcut(event, 'Mod+S')) save();",
      '',
    ].join('\n');
    const { source: after, todos } = run(source);
    expect(after).toBe(source);
    expect(todos.map((todo) => todo.line).sort()).toEqual([1, 1, 2, 3, 3, 4]);
    expect(todos.some((todo) => /commands\.matches/.test(todo.message))).toBe(true);
    expect(todos.some((todo) => /formatChord/.test(todo.message))).toBe(true);
    expect(run(after).source).toBe(after);
  });

  it('notes the Win+K change in its summary', () => {
    expect(migration.summary).toMatch(/Win\+K/);
  });

  it('leaves a file without the helpers alone', () => {
    expect(run("import { commands } from '@drizztdourden08/brock-react';\n").todos).toEqual([]);
  });
});
