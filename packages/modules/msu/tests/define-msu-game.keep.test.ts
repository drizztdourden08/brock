/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineMsuGame } from '../src/config/define-msu-game';
import type { MsuGameConfig } from '../src/config/msu-game-config.type';

const channel = (name: string, coreIndex: number): MsuGameConfig['soundChannels'][number] => ({
  name, kind: 'additive', bus: 'sfx', coreIndex, previewSeconds: 1,
});

const configWith = (soundChannels: MsuGameConfig['soundChannels']): MsuGameConfig => ({
  id: 'demo',
  packRoot: 'msu',
  soundChannels,
  soundIdCount: 32,
  trackLoops: () => true,
  classifyMusic: () => ({ kind: 'ignore' }),
  resumePath: (profile, kind, id) => `${profile}/${kind}/${id}.json`,
});

describe('defineMsuGame', { tags: ['critical'] }, () => {
  it('returns a valid config unchanged', () => {
    const config = configWith([channel('a', 0), channel('b', 1)]);
    expect(defineMsuGame(config)).toBe(config);
  });

  it('throws naming a duplicate channel name', () => {
    expect(() => defineMsuGame(configWith([channel('a', 0), channel('a', 1)]))).toThrow('"a"');
  });

  it('throws naming a duplicate coreIndex', () => {
    expect(() => defineMsuGame(configWith([channel('a', 3), channel('b', 3)]))).toThrow('coreIndex 3');
  });
});
