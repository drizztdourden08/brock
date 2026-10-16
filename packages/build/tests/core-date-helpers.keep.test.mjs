/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.57.0/core-date-helpers.mjs';

const run = (source) => migration.apply({ path: 'src/screens/home/home.page.tsx', source });

describe('the core-date-helpers migration', () => {
  it('turns each use of the old brock-core date helpers into a to-do pointing to Tessera', () => {
    const source = "import { formatDate, formatRelativeTime } from '@drizztdourden08/brock-core';\nconst a = formatRelativeTime(ts);\n";
    const { source: after, todos } = run(source);
    expect(after).toBe(source);
    expect(todos.length).toBeGreaterThanOrEqual(3);
    expect(todos.map((todo) => todo.message).join(' ')).toMatch(/DateText/);
    expect(run(after).source).toBe(after);
  });

  it('leaves a file that does not import brock-core alone', () => {
    expect(run("import { formatDate } from '@drizztdourden08/tessera/primitives';\nformatDate(ts, 'date');\n").todos).toEqual([]);
  });
});
