/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineMsuGame } from '../src/config/define-msu-game';
import type { MsuGameConfig } from '../src/config/msu-game-config.type';
import { demoConfig } from './demo-config.fixture';

const channel = (name: string, coreIndex: number): MsuGameConfig['soundChannels'][number] => ({
  name, kind: 'additive', bus: 'sfx', coreIndex, previewSeconds: 1,
});

describe('defineMsuGame', { tags: ['critical'] }, () => {
  it('returns a valid config unchanged', () => {
    const config = demoConfig([channel('a', 0), channel('b', 1)]);
    expect(defineMsuGame(config)).toBe(config);
  });

  it('throws naming a duplicate channel name', () => {
    expect(() => defineMsuGame(demoConfig([channel('a', 0), channel('a', 1)]))).toThrow('"a"');
  });

  it('throws naming a duplicate coreIndex', () => {
    expect(() => defineMsuGame(demoConfig([channel('a', 3), channel('b', 3)]))).toThrow('coreIndex 3');
  });
});
