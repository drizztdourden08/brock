/* @layer tooling-scripts @kind test */
import { PNG } from 'pngjs';
import { afterEach, describe, expect, it } from 'vitest';
import { wordmarkHeightWarnings } from '../src/installer/wordmark-height-warnings.mjs';
import { tempTree } from './temp-tree.mjs';

const tree = tempTree('brock-wordmark-height-');

afterEach(tree.cleanup);

const png = (width, height) => PNG.sync.write(Object.assign(new PNG({ width, height }), { data: Buffer.alloc(width * height * 4) }));
const svg = (attrs) => `<svg xmlns="http://www.w3.org/2000/svg" ${attrs}><rect width="10" height="10"/></svg>`;

const appWith = (files) => {
  const root = tree.tempDir();
  for (const [rel, data] of Object.entries(files)) tree.put(root, `public/${rel}`, data);
  return root;
};

const product = (wordmark) => ({ icons: { wordmark } });

describe('wordmarkHeightWarnings', () => {
  it('warns about a smooth PNG wordmark under 48 px high, naming its height', () => {
    const root = appWith({ 'logos/wordmark.png': png(120, 20) });
    const warnings = wordmarkHeightWarnings(root, product({ src: './logos/wordmark.png', dark: './logos/wordmark.png' }));
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/\.\/logos\/wordmark\.png is 20 px high/);
    expect(warnings[0]).toMatch(/at least 48 px high/);
  });

  it('reads the wordmark as brock.config.ts writes it, a plain path or an object without dark', () => {
    const root = appWith({ 'logos/wordmark.png': png(120, 30) });
    expect(wordmarkHeightWarnings(root, product('./logos/wordmark.png'))).toEqual([expect.stringContaining('is 30 px high')]);
    expect(wordmarkHeightWarnings(root, product({ src: './logos/wordmark.png' }))).toHaveLength(1);
    expect(wordmarkHeightWarnings(root, product('./logos/wordmark.png')).join()).not.toContain('undefined');
  });

  it('checks the dark variant beside the main file', () => {
    const root = appWith({ 'logos/w.png': png(400, 96), 'logos/w-dark.png': png(200, 24) });
    const warnings = wordmarkHeightWarnings(root, product({ src: './logos/w.png', dark: './logos/w-dark.png' }));
    expect(warnings).toEqual([expect.stringContaining('./logos/w-dark.png is 24 px high')]);
  });

  it('says nothing for a wordmark 48 px high or more, or for pixel art', () => {
    const root = appWith({ 'logos/tall.png': png(200, 48), 'logos/sprite.png': png(52, 8) });
    expect(wordmarkHeightWarnings(root, product({ src: './logos/tall.png', dark: './logos/tall.png' }))).toEqual([]);
    expect(wordmarkHeightWarnings(root, product({ src: './logos/sprite.png', dark: './logos/sprite.png', rendering: 'pixelated' }))).toEqual([]);
  });

  it('reads the height an SVG declares, and leaves one sized by its viewBox alone', () => {
    const root = appWith({
      'logos/short.svg': svg('width="160" height="32px" viewBox="0 0 160 32"'),
      'logos/box.svg': svg('viewBox="0 0 160 20"'),
    });
    expect(wordmarkHeightWarnings(root, product({ src: './logos/short.svg', dark: './logos/short.svg' })))
      .toEqual([expect.stringContaining('is 32 px high')]);
    expect(wordmarkHeightWarnings(root, product({ src: './logos/box.svg', dark: './logos/box.svg' }))).toEqual([]);
  });

  it('says nothing without a wordmark or when its file is missing', () => {
    const root = appWith({});
    expect(wordmarkHeightWarnings(root, {})).toEqual([]);
    expect(wordmarkHeightWarnings(root, product({ src: './logos/gone.png', dark: './logos/gone.png' }))).toEqual([]);
  });
});
