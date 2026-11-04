/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import type { Block } from '../src/provider/block.type';
import { diffSections } from '../src/runtime/diff-sections';

const rows = (value: number): Block[] => [{ kind: 'rows', rows: [{ label: 'a', value }] }];

describe('K3 diffSections', { tags: ['critical'] }, () => {
  it('reports only the changed section ids', () => {
    const prev = { location: rows(1), party: rows(1) };
    const next = { location: rows(1), party: rows(2) };
    expect(diffSections(prev, next)).toEqual(['party']);
  });

  it('reports nothing when equal', () => {
    expect(diffSections({ story: rows(1) }, { story: rows(1) })).toEqual([]);
  });

  it('ignores a custom block render function', () => {
    const custom = (): Block[] => [{ kind: 'custom', render: () => null }];
    expect(diffSections({ raw: custom() }, { raw: custom() })).toEqual([]);
  });
});
