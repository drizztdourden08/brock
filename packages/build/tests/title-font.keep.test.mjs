/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync } from 'node:fs';
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

const tableOf = (ttf, tag) => {
  const index = Array.from({ length: ttf.readUInt16BE(4) }, (_, at) => 12 + at * 16).find((record) => ttf.toString('latin1', record, record + 4) === tag);
  return ttf.subarray(ttf.readUInt32BE(index + 8), ttf.readUInt32BE(index + 8) + ttf.readUInt32BE(index + 12));
};

describe('titleFont', () => {
  it('turns Tessera\'s WOFF2 title font into a TrueType file resvg draws with', () => {
    const font = titleFont(TESSERA);
    expect(font?.family).toMatch(/^Chakra Petch/);
    expect(font.ttf.readUInt32BE(0)).toBe(0x00010000);
    const glyf = tableOf(font.ttf, 'glyf');
    const loca = tableOf(font.ttf, 'loca');
    const longOffsets = tableOf(font.ttf, 'head').readInt16BE(50) === 1;
    const last = longOffsets ? loca.readUInt32BE(loca.length - 4) : loca.readUInt16BE(loca.length - 2) * 2;
    expect(last).toBe(glyf.length);
    const drawn = rasteriseSvg(words(font.family), 240, font.ttf);
    expect(drawn.equals(rasteriseSvg(words(font.family), 240))).toBe(false);
    expect(drawn.equals(rasteriseSvg(words('Segoe UI'), 240))).toBe(false);
  });

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
