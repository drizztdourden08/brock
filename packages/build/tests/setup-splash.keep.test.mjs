/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { PNG } from 'pngjs';
import { afterEach, describe, expect, it } from 'vitest';
import { FALLBACK_THEME } from '../src/installer/installer.constants.mjs';
import { markSourceOf } from '../src/installer/mark-source.mjs';
import { contrast } from '../src/installer/pick-ink.mjs';
import { rasteriseSvg } from '../src/installer/rasterise-svg.mjs';
import { setupSplashPng } from '../src/installer/setup-splash-png.mjs';
import { setupSplashSvg } from '../src/installer/setup-splash-svg.mjs';
import { splashGround } from '../src/installer/splash-ground.mjs';

const BROCK_DARK = {
  ...FALLBACK_THEME, primary: '#f0862b', text: '#eeeeee', gradientDarkFrom: '#2e1d0c', gradientDarkTo: '#0f0a06',
};

const MARK_PNG = rasteriseSvg('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#7d7e81"/></svg>', 8);

const roots = [];

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

const tempDir = (files = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-setup-splash-'));
  roots.push(root);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
};

const config = (mark = './logos/mark.svg') => ({
  name: 'Brock App', icons: { brand: 'brock' }, logos: { mark }, window: { splash: { width: 480, height: 360 } },
});

const pixel = (png, x, y) => {
  const at = (png.width * y + x) * 4;
  return `#${[0, 1, 2].map((i) => png.data[at + i].toString(16).padStart(2, '0')).join('')}`;
};

describe('splashGround', () => {
  it('takes the palette dark gradient and its text, which holds AA at both ends', () => {
    const ground = splashGround(tempDir(), { dark: null, theme: BROCK_DARK });
    expect(ground).toEqual({ from: '#2e1d0c', to: '#0f0a06', ink: '#eeeeee' });
    expect(Math.min(contrast(ground.from, ground.ink), contrast(ground.to, ground.ink))).toBeGreaterThanOrEqual(4.5);
  });

  it('takes the dark pair of an app with colours of its own, then the pair theme.css sets', () => {
    expect(splashGround(tempDir(), { dark: { from: '#0C162D', to: '#090f12' }, theme: BROCK_DARK })).toMatchObject({ from: '#0c162d', to: '#090f12' });
    const themed = tempDir({ 'src/theme.css': ':root { --p-gradient-dark-from: #201030; --p-gradient-dark-to: #080410; }' });
    expect(splashGround(themed, { dark: null, theme: BROCK_DARK })).toMatchObject({ from: '#201030', to: '#080410' });
  });

  it('falls back to the surface and the background without a dark gradient, and to a readable ink when the text fails', () => {
    expect(splashGround(tempDir(), { dark: null, theme: FALLBACK_THEME })).toMatchObject({ from: '#1b1815', to: '#12100e' });
    expect(splashGround(tempDir(), { dark: null, theme: { ...BROCK_DARK, text: '#555555' } }).ink).toBe('#ffffff');
  });
});

describe('the Setup splash', () => {
  it('draws the dark ground with no glow and no shadow behind the mark', () => {
    const mark = { data: Buffer.from('<svg/>'), mime: 'image/svg+xml', from: 'mark.svg' };
    const ground = { from: '#2e1d0c', to: '#0f0a06', ink: '#eeeeee' };
    const svg = setupSplashSvg({ width: 480, height: 360, ground, angle: 160, mark, name: 'A & B' });
    expect(svg).toContain('stop-color="#2e1d0c"');
    expect(svg).toContain('stop-color="#0f0a06"');
    expect(svg).toContain('fill="#eeeeee"');
    expect(svg).toContain('>A &amp; B</text>');
    expect(svg).not.toMatch(/radialGradient|filter|#ffffff/);
  });

  it('reads the mark from brand/dark-ground', () => {
    const tesseraRoot = tempDir({ 'brand/dark-ground/brock/mark/mark-256.png': 'png', 'brand/light-rim/brock/mark/mark-256.png': 'png' });
    expect(markSourceOf(tempDir(), { config: config(), tesseraRoot }, { ground: 'dark' })).toMatchObject({ from: 'brand/dark-ground/brock/mark/mark-256.png' });
    expect(markSourceOf(tempDir(), { config: config(), tesseraRoot: tempDir({ 'brand/dark-ground/brock.svg': '<svg/>' }) }, { ground: 'dark' }))
      .toMatchObject({ from: 'brand/dark-ground/brock.svg' });
  });

  it('writes a PNG on the dark ground, dark everywhere the mark and the name are not', () => {
    const tesseraRoot = tempDir({ 'brand/dark-ground/brock/mark/mark-256.png': MARK_PNG });
    const ground = splashGround(tempDir(), { dark: null, theme: BROCK_DARK });
    const { png, from } = setupSplashPng(tempDir(), { config: config(), colours: { angle: 160 }, splash: ground, tesseraRoot });
    expect(from).toContain('brand/dark-ground/brock/mark/mark-256.png');
    const image = PNG.sync.read(png);
    expect([image.width, image.height]).toEqual([480, 360]);
    for (const [x, y] of [[0, 0], [479, 359], [240, 40], [240, 330], [100, 180], [380, 180]]) {
      expect(contrast(pixel(image, x, y), ground.ink)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(pixel(image, x, y), '#000000')).toBeLessThan(1.6);
    }
  });
});
