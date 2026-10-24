/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.80.0/documents-access-async.mjs';

const run = (source) => migration.apply({ path: 'src/main/files.ts', source });

describe('the documents-access-async migration', () => {
  it('flags each resolve and isAllowed call that is not awaited and leaves the source alone', () => {
    const source = [
      'const full = ctx.documents.resolve(path);',
      'if (documents.isAllowed(path)) read();',
      'const ok = await ctx.documents.resolve(path);',
      'if (await documents.isAllowed(path)) read();',
      'const next = await   ctx.documents.isAllowed(other);',
      '',
    ].join('\n');
    const { source: after, todos } = run(source);
    expect(after).toBe(source);
    expect(todos.map((todo) => todo.line)).toEqual([1, 2]);
    expect(todos[0]?.message).toMatch(/await documents\.resolve/);
    expect(todos[1]?.message).toMatch(/always truthy/);
    expect(run(after).source).toBe(after);
  });

  it('leaves a file that does not use them alone', () => {
    expect(run('ctx.documents.allow(path);\nawait ctx.documents.list(folder);\n').todos).toEqual([]);
  });
});
