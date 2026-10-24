/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.80.0/hub-page-header-off.mjs';

const run = (source) => migration.apply({ path: 'src/screens/data/library.page.tsx', source });

describe('the hub-page-header-off migration', () => {
  it('matches the page, custom and page meta files of src/screens only', () => {
    const matches = (path) => migration.files.test(path);
    expect(matches('src/screens/data/library.page.tsx')).toBe(true);
    expect(matches('apps/desktop/src/screens/data/library.custom.tsx')).toBe(true);
    expect(matches('src/screens/data/library.page.ts')).toBe(true);
    expect(matches('src/screens/data/library.hero.tsx')).toBe(false);
    expect(matches('src/views/Library/Library.page.tsx')).toBe(false);
  });

  it('turns a page with no header setting into a to-do at its meta', () => {
    const source = "const Page = () => null;\n\nexport const meta = { order: 2 };\nexport default Page;\n";
    const { source: after, todos } = run(source);
    expect(after).toBe(source);
    expect(todos).toHaveLength(1);
    expect(todos[0].line).toBe(3);
    expect(todos[0].message).toMatch(/showHeader: true/);
  });

  it('points a page that uses PageActions at the header or at bare', () => {
    const { todos } = run("import { PageActions } from '@x/brock-react';\nexport const meta = {};\n");
    expect(todos[0].message).toMatch(/PageActions/);
  });

  it('leaves a page that already sets showHeader, bare or header actions', () => {
    expect(run('export const meta = { showHeader: true };\n').todos).toEqual([]);
    expect(run('export const meta = { bare: true };\n').todos).toEqual([]);
    expect(run("export const meta = { header: { search: {} } };\n").todos).toEqual([]);
  });
});
