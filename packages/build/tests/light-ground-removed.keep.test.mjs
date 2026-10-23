/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.75.0/light-ground-removed.mjs';

const run = (source) => migration.apply({ path: 'brock.config.ts', source });

describe('the light-ground-removed migration', () => {
  it('turns a dark rim into a to-do and leaves the source alone', () => {
    const source = "icons: { brand: 'brock', rim: 'dark' },\n";
    const { source: after, todos } = run(source);
    expect(after).toBe(source);
    expect(todos).toHaveLength(1);
    expect(todos[0].message).toMatch(/'light' only/);
    expect(run(after).source).toBe(after);
  });

  it('turns a ground prop into a to-do', () => {
    const { todos } = run('<BrandMark app="brock" ground="dark" />\n');
    expect(todos).toHaveLength(1);
    expect(todos[0].message).toMatch(/ground prop/);
  });

  it('leaves a light rim alone', () => {
    expect(run("rim: 'light'\n").todos).toEqual([]);
  });
});
