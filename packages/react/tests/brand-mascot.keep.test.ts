/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { brandMascot } from '../src/brand/brand-mascot';

describe('brandMascot', () => {
  it('gives each brand its own mascot', () => {
    expect(brandMascot('brock')).toBe('flint');
    expect(brandMascot('archipelia')).toBe('pelago');
    expect(brandMascot('rotp')).toBe('sentri');
  });

  it('gives none to a brand without a mascot, an unknown brand or no brand', () => {
    expect(brandMascot('tessera')).toBeUndefined();
    expect(brandMascot('my-own-brand')).toBeUndefined();
    expect(brandMascot(undefined)).toBeUndefined();
  });
});
