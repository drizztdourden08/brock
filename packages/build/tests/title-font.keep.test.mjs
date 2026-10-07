/* @layer tooling-scripts @kind test */
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tesseraDir } from '../src/icons/tessera-dir.mjs';
import { rasteriseSvg } from '../src/installer/rasterise-svg.mjs';
import { setupSplashSvg } from '../src/installer/setup-splash-svg.mjs';
import { titleFont } from '../src/installer/title-font.mjs';

const TESSERA = tesseraDir(join(import.meta.dirname, '..', '..', '..', 'templates', 'app'));

const roots = [];

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
  vi.restoreAllMocks();
});

const words = (family) => `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="40"><text x="4" y="30" font-family="${family}" font-size="24">brock-check</text></svg>`;

describe('titleFont', () => {
  it('reads Tessera\'s TrueType title font, and the name draws in it with the system fonts loaded', () => {
    const font = titleFont(TESSERA);
    expect(font?.family).toBe('Chakra Petch SemiBold');
    expect(font.file.replace(/\\/g, '/')).toMatch(/fonts\/chakra-petch\/chakra-petch-latin-600-normal\.ttf$/);
    expect(readFileSync(font.file).readUInt32BE(0)).toBe(0x00010000);
    const drawn = rasteriseSvg(words(font.family), 240, font.file);
    expect(drawn.equals(rasteriseSvg(words(font.family), 240))).toBe(false);
    expect(drawn.equals(rasteriseSvg(words('Segoe UI'), 240))).toBe(false);
  }, 60_000);

  it('falls back to Segoe UI, saying so once, when the font cannot be read', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const root = mkdtempSync(join(tmpdir(), 'brock-title-font-'));
    roots.push(root);
    expect(titleFont(root)).toBeNull();
    expect(titleFont(root)).toBeNull();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toMatch(/Segoe UI/);
  });

  it('names the title font ahead of Segoe UI on the Setup splash', () => {
    const mark = { data: Buffer.from('<svg/>'), mime: 'image/svg+xml', from: 'mark.svg' };
    const input = { width: 480, height: 360, ground: { from: '#2e1d0c', to: '#0f0a06', ink: '#eeeeee' }, angle: 160, mark, name: 'Brock' };
    expect(setupSplashSvg({ ...input, family: 'Chakra Petch SemiBold' })).toContain('font-family="&#39;Chakra Petch SemiBold&#39;, &#39;Segoe UI&#39;"');
    expect(setupSplashSvg(input)).toContain('font-family="Segoe UI"');
  });
});
