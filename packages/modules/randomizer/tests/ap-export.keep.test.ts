/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { exportApWorld, exportedOptionsOf, helperCallsOf, readItemsOf, specializeRuleNode } from '../src/archipelago/export';
import { needs, toyExportWorld, toyRegistry, toySource } from './ap-export.fixture';
import type { Readings } from '../src/archipelago/export';
import type { RuleNode } from '../src/world';

const readings: Readings = {
  option: (key) => key === 'easy',
  seed: (key) => (key === 'mode' ? 'hard' : 0),
};

const specialize = (node: RuleNode): RuleNode => specializeRuleNode(node, toyExportWorld(), readings, toyRegistry);

describe('exportApWorld', { tags: ['critical'] }, () => {
  it('writes the six files in order with the game block first', () => {
    const exported = exportApWorld(toySource());
    expect(Object.keys(exported)).toEqual([
      'game.json', 'locations.json', 'regions.json', 'items.json', 'rules.json', 'options.json',
    ]);
    expect(exported['game.json']).toEqual({ game: 'Toy', worldVersion: '0.1.0', goalEvent: 'win' });
  });

  it('keeps each location key order and adds the hook answers', () => {
    const locations = exportApWorld(toySource())['locations.json'] as Record<string, unknown>[];
    expect(Object.keys(locations[0] ?? {})).toEqual(['key', 'id', 'name', 'region', 'prize', 'requires', 'rule']);
    expect(locations.find((location) => location['key'] === 'f1')?.['requires']).toEqual({ present: 'shop' });
    expect(locations.find((location) => location['key'] === 'l2')?.['prize']).toBe(true);
  });

  it('closes the options with the two package rows', () => {
    const options = exportApWorld(toySource())['options.json'] as { key: string }[];
    expect(options.map((option) => option.key)).toEqual(['easy', 'seed_text', 'pre_rolled']);
  });

  it('throws on two items with one name', () => {
    const source = toySource({ itemNames: { 100: 'Key', 101: 'Key', 102: 'Lamp', 103: 'Rock', 104: 'Pebble' } });
    expect(() => exportApWorld(source)).toThrow('two items named Key');
  });

  it('throws on a location without an id and on an event sharing a name', () => {
    expect(() => exportApWorld(toySource({ locationIds: { t1: 1 } }))).toThrow('location has no Archipelago id: t2');
    expect(() => exportApWorld(toySource({ eventName: () => 'Key' }))).toThrow(
      'story event shares a name with a location or item: Key',
    );
  });

  it('lists the derived helper calls sorted by name and arguments', () => {
    const rules = exportApWorld(toySource())['rules.json'] as { helpers: { name: string; args: unknown[] }[] };
    expect(rules.helpers.map((call) => `${call.name}${JSON.stringify(call.args)}`))
      .toEqual(['keyReady[]', 'needs[1]', 'needs[2]']);
  });
});

describe('specializeRuleNode', { tags: ['critical'] }, () => {
  it('folds option and seed readings to true or false', () => {
    expect(specialize({ op: 'option', key: 'easy', equals: true })).toEqual({ op: 'true' });
    expect(specialize({ op: 'seed', key: 'mode', equals: 'easy' })).toEqual({ op: 'false' });
  });

  it('picks the branch of an if once its condition is known', () => {
    const node: RuleNode = {
      op: 'if', cond: { op: 'option', key: 'easy', equals: true }, then: { op: 'has', item: 'boat' }, else: { op: 'false' },
    };
    expect(specialize(node)).toEqual({ op: 'has', item: 'boat' });
  });

  it('drops absorbed parts and inlines derived helpers', () => {
    const node: RuleNode = { op: 'all', of: [{ op: 'option', key: 'easy', equals: true }, needs(2)] };
    expect(specialize(node)).toEqual({ op: 'has', item: 'key', count: 2 });
    expect(specialize({ op: 'any', of: [{ op: 'false' }, { op: 'option', key: 'easy', equals: false }] }))
      .toEqual({ op: 'false' });
  });

  it('reads setting arguments before expanding', () => {
    const call: RuleNode = { op: 'helper', name: 'needs', args: [{ option: 'easy' }] };
    expect(specialize(call)).toEqual({ op: 'has', item: 'key', count: 1 });
  });
});

describe('helperCallsOf', { tags: ['critical'] }, () => {
  it('refuses a derived helper called with a setting argument', () => {
    const call: RuleNode = { op: 'helper', name: 'needs', args: [{ option: 'easy' }] };
    expect(() => helperCallsOf(toyExportWorld(), [call], toyRegistry)).toThrow(
      'derived helper called with a setting or seed argument: needs[{"option":"easy"}]',
    );
  });
});

describe('exported options and read items', { tags: ['critical'] }, () => {
  it('numbers choices by position, or by value when all are whole numbers', () => {
    const rows = exportedOptionsOf([
      { key: 'a', kind: 'choice', displayName: 'A', description: '', baseline: 'x', choices: [{ value: 'x' }, { value: 'y' }], locked: false },
      { key: 'b', kind: 'choice', displayName: 'B', description: '', baseline: 3, choices: [{ value: '3' }, { value: '7' }], locked: false },
    ]);
    expect(rows[0]?.choices).toEqual([{ value: 'x', id: 0 }, { value: 'y', id: 1 }]);
    expect(rows[1]?.choices).toEqual([{ value: '3', id: 3 }, { value: '7', id: 7 }]);
    expect(rows[1]?.numeric).toBe(true);
  });

  it('collects the items rules read, and asks the game for primitive helpers', () => {
    const trees: RuleNode[] = [
      { op: 'has', item: 'boat' }, { op: 'hasAny', items: ['rock'] }, { op: 'helper', name: 'canSwim', args: [1] },
    ];
    expect([...readItemsOf(trees, (helper) => (helper === 'canSwim' ? ['flippers'] : []))].sort())
      .toEqual(['boat', 'flippers', 'rock']);
  });
});
