/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { MAIN_FILL, createCollectionState, createWorldKit } from '../src/world';
import { createWorldFromDef } from '../src/world/define/create-world-from-def';
import { toyWorldDef } from './toy-world.fixture';

const kit = createWorldKit();

const stateWith = (...items: string[]) => {
  const state = createCollectionState(createWorldFromDef(toyWorldDef(), { seed: 'kit' }));
  items.forEach((item) => state.collect(item));
  return state;
};

describe('world kit', { tags: ['critical'] }, () => {
  it('evaluates item rules on a collection state', () => {
    const rule = kit.hasItem('key');
    expect(kit.has('key')).toEqual({ op: 'has', item: 'key' });
    expect(rule(stateWith())).toBe(false);
    expect(rule(stateWith('key'))).toBe(true);
  });

  it('gives constant rules', () => {
    expect(kit.always(stateWith())).toBe(true);
    expect(kit.never(stateWith('key'))).toBe(false);
  });

  it('reuses the main fill id', () => {
    expect(kit.mainFill.id).toBe(MAIN_FILL.id);
  });
});
