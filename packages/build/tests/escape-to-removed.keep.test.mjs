/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.62.0/escape-to-removed.mjs';

const run = (source) => migration.apply({ path: 'src/screens/home/home.page.tsx', source });

describe('the escape-to-removed migration', () => {
  it('turns each use of setEscapeTo or escapeTo into a to-do and leaves the source alone', () => {
    const source = "import { useNavigationStore } from '@drizztdourden08/brock-react';\nuseNavigationStore.getState().setEscapeTo(null);\n";
    const { source: after, todos } = run(source);
    expect(after).toBe(source);
    expect(todos).toHaveLength(1);
    expect(todos[0].message).toMatch(/nav\.reopen\(\)/);
    expect(run(after).source).toBe(after);
  });

  it('leaves a file that does not import brock-react alone', () => {
    expect(run('const escapeTo = 1;\n').todos).toEqual([]);
  });
});
