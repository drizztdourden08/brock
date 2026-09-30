/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { resolveLook } from '../src/look/resolve-look';
import { mixHex } from '../src/look/mix-hex';
import { DEFAULT_LOOK_ANGLE } from '../src/look/look.constants';

const seeds = { primary: '#3b6fe0', black: '#0e0e12' };

describe('resolveLook', () => {
  it('derives a gradient from the palette seeds when nothing else is set', () => {
    const look = resolveLook({}, { seeds });
    expect(look).toEqual({
      from: '#3b6fe0', via: mixHex('#3b6fe0', '#0e0e12', 0.4), to: '#0e0e12', angle: DEFAULT_LOOK_ANGLE, accent: '#3b6fe0', source: 'palette',
    });
  });

  it('prefers the Tessera brand gradient over the palette', () => {
    const look = resolveLook({}, { seeds, brand: { gradient: ['#f0862b', '#1a1208'], angle: 135 } });
    expect(look).toMatchObject({ from: '#f0862b', via: null, to: '#1a1208', angle: 135, source: 'brand' });
  });

  it('lets product.look win over the brand and keeps the accent from config', () => {
    const look = resolveLook(
      { accent: '#e8a33d', look: { gradient: ['#101010', '#202020', '#181818'] } },
      { seeds, brand: { gradient: ['#f0862b', '#1a1208'] } },
    );
    expect(look).toEqual({ from: '#101010', via: '#181818', to: '#202020', angle: DEFAULT_LOOK_ANGLE, accent: '#e8a33d', source: 'product' });
  });
});

describe('mixHex', () => {
  it('mixes two colours channel by channel', () => {
    expect(mixHex('#ffffff', '#000000', 0.5)).toBe('#808080');
    expect(mixHex('#3b6fe0', '#0e0e12', 1)).toBe('#3b6fe0');
  });

  it('rejects a value that is not a six digit colour', () => {
    expect(() => mixHex('blue', '#000000', 0.5)).toThrow();
  });
});
