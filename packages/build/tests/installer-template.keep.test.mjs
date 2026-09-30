/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkInstallerFolder } from '../src/installer/check-installer-folder.mjs';
import { gradientLine } from '../src/installer/gradient-line.mjs';
import { FALLBACK_THEME } from '../src/installer/installer.constants.mjs';
import { installerTheme } from '../src/installer/installer-theme.mjs';
import { markSourceOf } from '../src/installer/mark-source.mjs';
import { setupSplashSvg } from '../src/installer/setup-splash-svg.mjs';
import { stubColours } from '../src/installer/stub-colours.mjs';
import { stubProductHeader } from '../src/packaging/stub-product-header.mjs';
import { vpkPackArgs } from '../src/packaging/vpk-args.mjs';

const TOKENS = {
  brands: { brock: { gradient: ['#f0862b', '#101014'], angle: 150 } },
  theme: {
    dark: {
      bg: '#101014', surface: '#1A1A20', hairline: '#2c2c35', text: '#ececf1', textDim: '#a0a0ad', textFaint: '#6e6e7a',
      primary: '#f0862b', onPrimary: '#101014',
    },
    radius: {},
    space: {},
  },
};

const LOOK = { from: '#3B6FE0', via: null, to: '#0e0e12', angle: 160, accent: '#E8A33D', ink: '#F2F3F7', shade: '#0e0f13', source: 'palette' };

const INSTALLER = { scope: 'user', shortcuts: { desktop: true, startMenu: true }, launchAfterInstall: true, folderName: 'Brock App' };

const CONFIG = {
  id: 'brock-app', name: 'Brock "App"', description: 'A blank Brock app.', author: { name: 'someone' }, installer: INSTALLER,
};

const roots = [];

const tempDir = (files = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-installer-'));
  roots.push(root);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
};

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('installerTheme', () => {
  it('falls back to the built-in colours and says so once when tokens.json is missing', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const root = tempDir();
    expect(installerTheme(root)).toBe(FALLBACK_THEME);
    expect(installerTheme(root)).toBe(FALLBACK_THEME);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toMatch(/tokens\.json/);
  });

  it('reads the resolved dark theme from tokens.json, lower cased', () => {
    const root = tempDir({ 'tokens.json': JSON.stringify(TOKENS) });
    expect(installerTheme(root)).toMatchObject({ bg: '#101014', surface: '#1a1a20', primary: '#f0862b', onPrimary: '#101014' });
  });

  it('falls back when the dark theme misses a colour', () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const partial = { theme: { dark: { ...TOKENS.theme.dark, textFaint: 'grey' } } };
    expect(installerTheme(tempDir({ 'tokens.json': JSON.stringify(partial) }))).toBe(FALLBACK_THEME);
  });
});

describe('stubColours', () => {
  it('keeps the colours the stub had before tokens.json existed', () => {
    const colours = stubColours(LOOK, FALLBACK_THEME);
    expect(colours).toEqual({
      bg: '#12100e', surface: '#1b1815', hairline: '#322b24', text: '#ece6da', dim: '#a89e8d', faint: '#7c7365',
      accent: '#e8a33d', onAccent: '#1a1207', track: '#221e1a', stamp: '#463f36',
      from: '#3b6fe0', via: '#253f79', to: '#0e0e12', angle: 160, ink: '#f2f3f7',
    });
  });

  it('maps the Tessera theme and derives the track and the stamp from it', () => {
    const theme = installerTheme(tempDir({ 'tokens.json': JSON.stringify(TOKENS) }));
    const colours = stubColours({ ...LOOK, via: '#6b3a1a' }, theme);
    expect(colours).toMatchObject({ bg: '#101014', dim: '#a0a0ad', faint: '#6e6e7a', via: '#6b3a1a' });
    expect(colours.track).toBe('#1f1f26');
    expect(colours.stamp).toBe('#3e3e48');
  });

  it('outlines with border and writes quiet text with textMuted when Tessera has them', () => {
    const dark = { ...TOKENS.theme.dark, border: '#27272B', textMuted: '#81818a' };
    const theme = installerTheme(tempDir({ 'tokens.json': JSON.stringify({ theme: { dark } }) }));
    expect(stubColours(LOOK, theme)).toMatchObject({ hairline: '#27272b', faint: '#81818a' });
  });

  it('uses onPrimary on the Tessera primary and the most readable ink on any other accent', () => {
    const theme = installerTheme(tempDir({ 'tokens.json': JSON.stringify(TOKENS) }));
    expect(stubColours({ ...LOOK, accent: '#F0862B' }, theme).onAccent).toBe('#101014');
    expect(stubColours({ ...LOOK, accent: '#1d2a6b' }, theme).onAccent).toBe('#ececf1');
  });

  it('takes the text colour for the gradient from the look', () => {
    expect(stubColours({ ...LOOK, ink: '#101014' }, FALLBACK_THEME).ink).toBe('#101014');
  });
});

describe('stubProductHeader', () => {
  const header = (installer = INSTALLER) =>
    stubProductHeader({ config: { ...CONFIG, installer }, colours: stubColours(LOOK, FALLBACK_THEME), manifestUrl: 'https://x/install.json' });

  it('writes every colour, the gradient and the angle as macros', () => {
    const text = header();
    expect(text).toContain('#define BROCK_C_BG 0xFF12100E');
    expect(text).toContain('#define BROCK_C_ACCENT 0xFFE8A33D');
    expect(text).toContain('#define BROCK_C_ON_ACCENT 0xFF1A1207');
    expect(text).toContain('#define BROCK_C_TRACK 0xFF221E1A');
    expect(text).toContain('#define BROCK_LOOK_FROM 0xFF3B6FE0');
    expect(text).toContain('#define BROCK_LOOK_VIA 0xFF253F79');
    expect(text).toContain('#define BROCK_LOOK_ANGLE 160.0f');
    expect(text).toContain('#define BROCK_C_HEADER_INK 0xFFF2F3F7');
    for (const name of ['BG', 'SURFACE', 'HAIRLINE', 'TEXT', 'DIM', 'FAINT', 'ACCENT', 'ON_ACCENT', 'TRACK', 'STAMP']) {
      expect(text).toMatch(new RegExp(`#define BROCK_C_${name} 0xFF[0-9A-F]{6}\\n`));
    }
  });

  it('escapes names and carries the product.installer defaults', () => {
    const text = header();
    expect(text).toContain('#define BROCK_PRODUCT L"Brock \\"App\\""');
    expect(text).toContain('#define BROCK_INSTALL_FOLDER L"Brock App"');
    expect(text).toContain('#define BROCK_INSTALL_MACHINE 0');
    expect(text).toContain('#define BROCK_LAUNCH_AFTER 1');
    expect(text).toContain('#define BROCK_HAS_LICENCE 0');
  });

  it('turns the install choices into flags', () => {
    const text = header({ ...INSTALLER, scope: 'machine', launchAfterInstall: false, licence: 'LICENCE.md' });
    expect(text).toContain('#define BROCK_INSTALL_MACHINE 1');
    expect(text).toContain('#define BROCK_LAUNCH_AFTER 0');
    expect(text).toContain('#define BROCK_HAS_LICENCE 1');
  });
});

describe('vpkPackArgs', () => {
  const args = (installer) => vpkPackArgs({
    product: { ...CONFIG, name: 'Brock App' }, version: '1.0.0', platform: 'win32', packDir: 'p', outputDir: 'o', extras: { installer, full: true },
  });

  it('passes the shortcuts and the licence to vpk', () => {
    const list = args({ ...INSTALLER, licence: 'LICENCE.md' });
    expect(list[list.indexOf('--shortcuts') + 1]).toBe('Desktop,StartMenuRoot');
    expect(list[list.indexOf('--instLicense') + 1]).toBe('LICENCE.md');
  });

  it('asks vpk for no shortcuts when both are off', () => {
    const list = args({ ...INSTALLER, shortcuts: { desktop: false, startMenu: false } });
    expect(list[list.indexOf('--shortcuts') + 1]).toBe('None');
    expect(list).not.toContain('--instLicense');
  });
});

describe('Setup splash', () => {
  it('runs the CSS gradient line through the middle of the image', () => {
    expect(gradientLine(480, 360, 180)).toEqual({ x1: 240, y1: 0, x2: 240, y2: 360 });
    expect(gradientLine(480, 360, 90)).toEqual({ x1: 0, y1: 180, x2: 480, y2: 180 });
  });

  it('draws the look, the mark and the escaped name', () => {
    const mark = { data: Buffer.from('<svg/>'), mime: 'image/svg+xml', from: 'mark.svg' };
    const svg = setupSplashSvg({ width: 480, height: 360, colours: stubColours(LOOK, FALLBACK_THEME), mark, name: 'A & B' });
    expect(svg).toContain('stop-color="#3b6fe0"');
    expect(svg).toContain('stop-color="#253f79"');
    expect(svg).toContain('data:image/svg+xml;base64,');
    expect(svg).toContain('>A &amp; B</text>');
  });
});

describe('markSourceOf', () => {
  const config = (mark = './logos/mark.svg') => ({ icons: { brand: 'brock' }, logos: { mark } });

  it('prefers the Tessera mark PNG, then the app mark, then the brand SVG', () => {
    const tesseraRoot = tempDir({ 'brand/brock/mark/mark-256.png': 'png', 'brand/brock.svg': '<svg/>' });
    const rootDir = tempDir({ 'public/logos/mark.svg': '<svg/>' });
    expect(markSourceOf(rootDir, { config: config(), tesseraRoot })).toMatchObject({ mime: 'image/png', from: 'brand/brock/mark/mark-256.png' });
    expect(markSourceOf(rootDir, { config: config(), tesseraRoot: tempDir() })).toMatchObject({ from: 'public/logos/mark.svg' });
    expect(markSourceOf(tempDir(), { config: config(), tesseraRoot: tempDir({ 'brand/brock.svg': '<svg/>' }) })).toMatchObject({ from: 'brand/brock.svg' });
  });

  it('keeps an app mark that is not the default over the brand', () => {
    const tesseraRoot = tempDir({ 'brand/brock/mark/mark-256.png': 'png' });
    const rootDir = tempDir({ 'public/logos/own.svg': '<svg/>' });
    expect(markSourceOf(rootDir, { config: config('./logos/own.svg'), tesseraRoot })).toMatchObject({ from: 'public/logos/own.svg' });
  });
});

describe('checkInstallerFolder', () => {
  it('accepts the two overrides and names anything else', () => {
    const root = tempDir({ 'build/installer/header.png': 'x', 'build/installer/splash.png': 'x', 'build/installer/notes.txt': 'x' });
    expect(checkInstallerFolder(root, root)).toEqual([
      'build/installer/notes.txt: build/installer holds only header.png and splash.png; the rest of the installer comes from brock.config.ts',
    ]);
  });

  it('has nothing to say without the folder', () => {
    expect(checkInstallerFolder(tempDir(), tempDir())).toEqual([]);
  });
});
