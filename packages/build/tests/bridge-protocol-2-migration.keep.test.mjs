/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.80.0/bridge-protocol-2.mjs';

const run = (source) => migration.apply({ path: 'src/helper/main.ts', source });

describe('the bridge-protocol-2 migration', () => {
  it('turns a helper client into a rebuild to-do and leaves the source alone', () => {
    const source = "import { connectBridge } from '@drizztdourden08/brock-electron/bridge';\nconst bridge = connectBridge({ app: 'bxel' });\n";
    const { source: after, todos } = run(source);
    expect(after).toBe(source);
    expect(todos).toHaveLength(2);
    expect(todos[0].message).toMatch(/protocol 2/);
    expect(run(after).source).toBe(after);
  });

  it('flags emitTo, whose result is now a count', () => {
    expect(run('if (bridge.emitTo(id, EVENT, 1)) done();\n').todos[0].message).toMatch(/count/);
  });

  it('leaves other code alone', () => {
    expect(run('const x = connect();\n').todos).toEqual([]);
  });
});
