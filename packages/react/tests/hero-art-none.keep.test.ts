/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { heroArtOf } from '../src/screens/kinds/hero-art-of';

describe('K1 hero art none', { tags: ['critical'] }, () => {
  it('turns kind none into no art', () => {
    expect(heroArtOf({ kind: 'none' })).toBeNull();
    expect(heroArtOf({ kind: 'image', src: 'a.png' })).toEqual({ kind: 'image', src: 'a.png', alt: undefined, pixelated: undefined });
  });
});
