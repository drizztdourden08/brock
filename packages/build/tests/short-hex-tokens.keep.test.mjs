/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { readThemeTokens } from '../src/installer/read-theme-tokens.mjs';
import { longHex } from '../src/look/long-hex.mjs';
import { readBrandLook } from '../src/look/read-brand-look.mjs';
import { readLookInks } from '../src/look/read-look-inks.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

const DARK = { bg: '#000', surface: '#17171a', hairline: '#0f0f0f', text: '#F0F0F2', textDim: '#9a9aa4', textFaint: '#81818a', primary: '#8a8a96', onPrimary: '#fff' };
const TOKENS = { brands: { brock: { gradient: ['#000', '#f0862b'] } }, theme: { dark: DARK }, palettes: { brock: { dark: { ...DARK, textDim: '#abc' } } } };

const tessera = () => tempRepo({ 'tokens.json': JSON.stringify(TOKENS) });

afterEach(removeTempRepos);

describe('K1 short hex tokens', { tags: ['critical'] }, () => {
  it('expands #rgb, lowers #rrggbb and refuses anything else', () => {
    expect(longHex('#0aF')).toBe('#00aaff');
    expect(longHex('#F0862B')).toBe('#f0862b');
    expect(longHex('#0000')).toBeUndefined();
    expect(longHex(12)).toBeUndefined();
  });

  it('reads the splash inks, the brand gradient and the installer theme from short hex tokens', () => {
    const root = tessera();
    expect(readLookInks(root, 'brock')).toEqual({ light: '#f0f0f2', dark: '#000000', dim: '#aabbcc' });
    expect(readBrandLook(root, 'brock')).toEqual({ gradient: ['#000000', '#f0862b'] });
    expect(readThemeTokens(root, 'brock')).toMatchObject({ bg: '#000000', onPrimary: '#ffffff', textDim: '#aabbcc' });
  });
});
