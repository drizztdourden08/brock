/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { FillError, MAIN_FILL, createRng, generate, worldGameFromDef } from '../src/world';
import type { FillBuild, FillPhase } from '../src/world';
import { toyWorldDef } from './toy-world.fixture';

const SEED = 'toy-seed';

const probeInto = (draws: number[]): FillPhase => ({
  id: 'probe',
  run: (_build, rng) => {
    draws.push(rng.next());
  },
});

const placeFixed = (spots: Record<string, string>): FillPhase => ({
  id: 'prefill',
  run: (build: FillBuild) => {
    for (const [location, item] of Object.entries(spots)) build.world.placedItems.set(location, item);
  },
});

describe('world generate', { tags: ['critical'] }, () => {
  it('gives the same placement for the same seed', () => {
    const game = worldGameFromDef(toyWorldDef());
    const first = generate(game, { seed: SEED });
    expect(generate(game, { seed: SEED })).toEqual(first);
    expect(first.locations).toHaveLength(5);
    expect(first.attempts).toBe(1);
  });

  it('runs the phases in order and hands each one the attempt rng', () => {
    const draws: number[] = [];
    const order: string[] = [];
    const named = (id: string): FillPhase => ({ id, run: () => { order.push(id); } });
    const game = worldGameFromDef(toyWorldDef({
      fillPhases: [named('first'), probeInto(draws), named('second'), MAIN_FILL],
    }));
    generate(game, { seed: SEED });
    expect(order).toEqual(['first', 'second']);
    expect(draws).toEqual([createRng(SEED).next()]);
  });

  it('retries a FillError from finish with the retry seed', () => {
    const draws: number[] = [];
    const base = worldGameFromDef(toyWorldDef({ fillPhases: [probeInto(draws), MAIN_FILL] }));
    const game = {
      ...base,
      finish: (done: Parameters<typeof base.finish>[0]) => {
        if (done.attempts === 1) throw new FillError('toy', 'forced');
        return base.finish(done);
      },
    };
    const placement = generate(game, { seed: SEED });
    expect(placement.attempts).toBe(2);
    expect(draws).toEqual([createRng(SEED).next(), createRng(`${SEED}#retry1`).next()]);
  });

  it('rethrows an error that is not a FillError', () => {
    const boom: FillPhase = { id: 'boom', run: () => { throw new RangeError('boom'); } };
    const game = worldGameFromDef(toyWorldDef({ fillPhases: [boom, MAIN_FILL] }));
    expect(() => generate(game, { seed: SEED })).toThrow(RangeError);
  });

  it('counts spheres the way a hand walk of the toy world does', () => {
    const game = worldGameFromDef(toyWorldDef({
      buildPool: () => ({ progression: [], rest: [] }),
      fillPhases: [
        placeFixed({ t1: 'key', t2: 'rock', f1: 'boat', l1: 'lamp', l2: 'pebble' }),
        MAIN_FILL,
      ],
    }));
    const placement = generate(game, { seed: SEED });
    expect(placement.spheres.map((sphere) => sphere.locations)).toEqual([
      ['t1', 't2'],
      ['f1'],
      ['l1', 'l2'],
    ]);
  });
});
