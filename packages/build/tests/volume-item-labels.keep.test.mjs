/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.59.0/volume-item-labels.mjs';

const run = (source) => migration.apply({ path: 'src/title-bar/sound.action.ts', source });

describe('the volume-item-labels migration', () => {
  it('leaves a to-do on the labels of a volume item and changes nothing', () => {
    const source = [
      "import { useVolumeStore } from '@drizztdourden08/brock-react';",
      'const useSound = () => ({',
      "  kind: 'volume',",
      "  label: 'Sound',",
      "  labels: { mute: 'Off', unmute: 'On' },",
      '});',
      '',
    ].join('\n');
    const { source: after, todos } = run(source);
    expect(after).toBe(source);
    expect(todos.map((todo) => todo.line)).toEqual([5]);
    expect(todos[0].message).toMatch(/no longer takes labels/);
    expect(run(after)).toEqual({ source, todos });
  });

  it('flags the removed TitleBarVolumeStrings type', () => {
    const { todos } = run("import type { TitleBarVolumeStrings } from '@drizztdourden08/brock-react';\n");
    expect(todos.map((todo) => todo.line)).toEqual([1]);
  });

  it('leaves labels outside a volume item alone', () => {
    expect(run("const scale = { kind: 'slider', labels: ['Low', 'High'] };\n").todos).toEqual([]);
  });
});
