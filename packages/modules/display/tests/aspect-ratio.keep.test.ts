/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectScreenRatio, validateCustomRatio } from '../src/aspect-ratio/index';

const MIN_ASPECT = 256 / (224 + 2 * 128);
const MAX_ASPECT = (256 + 2 * 384) / 240;
const LIMITS = { min: MIN_ASPECT, max: MAX_ASPECT };

describe('validateCustomRatio', { tags: ['critical'] }, () => {
  it('accepts ratios from 4:3 up to the wide ceiling', () => {
    expect(validateCustomRatio(4, 3, LIMITS).valid).toBe(true);
    expect(validateCustomRatio(16, 9, LIMITS).valid).toBe(true);
    expect(validateCustomRatio(32, 9, LIMITS).valid).toBe(true);
  });

  it('accepts tall (taller-than-4:3) ratios down to the portrait floor', () => {
    expect(validateCustomRatio(5, 4, LIMITS).valid).toBe(true);
    expect(validateCustomRatio(1, 1, LIMITS).valid).toBe(true);
    expect(validateCustomRatio(3, 4, LIMITS).valid).toBe(true);
    expect(validateCustomRatio(9, 16, LIMITS).valid).toBe(true);
  });

  it('rejects ratios taller than the portrait floor', () => {
    const r = validateCustomRatio(1, 2, LIMITS);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/tall/i);
  });

  it('rejects ratios wider than the max', () => {
    expect(validateCustomRatio(9, 2, LIMITS).valid).toBe(false);
    expect(validateCustomRatio(5, 1, LIMITS).valid).toBe(false);
  });

  it('rejects non-integer or non-positive input', () => {
    expect(validateCustomRatio(16.5, 9, LIMITS).valid).toBe(false);
    expect(validateCustomRatio(0, 9, LIMITS).valid).toBe(false);
    expect(validateCustomRatio(Number.NaN, 9, LIMITS).valid).toBe(false);
  });
});

describe('detectScreenRatio', { tags: ['critical'] }, () => {
  afterEach(() => vi.unstubAllGlobals());

  it('GCD-reduces a landscape phone screen', () => {
    vi.stubGlobal('window', { screen: { width: 1920, height: 1080 } });
    expect(detectScreenRatio(LIMITS)).toEqual({ w: 16, h: 9 });
  });

  it('normalizes a portrait screen to its landscape ratio', () => {
    vi.stubGlobal('window', { screen: { width: 1080, height: 1920 } });
    expect(detectScreenRatio(LIMITS)).toEqual({ w: 16, h: 9 });
  });

  it('keeps a portrait screen portrait when asked', () => {
    vi.stubGlobal('window', { screen: { width: 1080, height: 1920 } });
    expect(detectScreenRatio(LIMITS, false, true)).toEqual({ w: 9, h: 16 });
  });

  it('clamps a kept portrait screen to the portrait floor', () => {
    vi.stubGlobal('window', { screen: { width: 1080, height: 2400 } });
    const { w, h } = detectScreenRatio(LIMITS, false, true);
    expect(w / h).toBeGreaterThanOrEqual(MIN_ASPECT - 1e-6);
    expect(w).toBeLessThan(h);
  });

  it('renders a 5:4 screen at its own (mildly tall) ratio', () => {
    vi.stubGlobal('window', { screen: { width: 1280, height: 1024 } });
    expect(detectScreenRatio(LIMITS)).toEqual({ w: 5, h: 4 });
  });

  it('clamps ultra-wide screens to the max', () => {
    vi.stubGlobal('window', { screen: { width: 5120, height: 1080 } });
    const { w, h } = detectScreenRatio(LIMITS);
    expect(w / h).toBeLessThanOrEqual(MAX_ASPECT + 1e-6);
  });
});
