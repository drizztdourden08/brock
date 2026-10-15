/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { anyTypeFor } from '../src/platform/any-type-for';

const PHONE = { host: 'capacitor', formFactor: 'mobile' } as const;
const DESKTOP = { host: 'electron', formFactor: 'desktop' } as const;

describe('anyTypeFor', () => {
  it('keeps true for every host and false or nothing for none', () => {
    expect([anyTypeFor(true, PHONE), anyTypeFor(true, DESKTOP)]).toEqual([true, true]);
    expect([anyTypeFor(false, PHONE), anyTypeFor(undefined, DESKTOP)]).toEqual([false, false]);
  });

  it('reads a host or form factor name', () => {
    expect([anyTypeFor('mobile', PHONE), anyTypeFor('mobile', DESKTOP)]).toEqual([true, false]);
    expect([anyTypeFor('electron', PHONE), anyTypeFor('electron', DESKTOP)]).toEqual([false, true]);
  });

  it('reads a per-host map, the host winning over the form factor', () => {
    expect([anyTypeFor({ mobile: true }, PHONE), anyTypeFor({ mobile: true }, DESKTOP)]).toEqual([true, false]);
    expect(anyTypeFor({ mobile: true, capacitor: false }, PHONE)).toBe(false);
    expect(anyTypeFor({ desktop: false, electron: true }, DESKTOP)).toBe(true);
    expect(anyTypeFor({}, PHONE)).toBe(false);
  });
});
