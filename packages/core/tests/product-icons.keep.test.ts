/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('product.icons.rim', () => {
  it('gives the brock brand the light rim', () => {
    expect(defineProduct({ ...BASE, icons: { brand: 'brock' } }).icons.rim).toBe('light');
  });

  it('keeps the rim an app sets', () => {
    expect(defineProduct({ ...BASE, icons: { brand: 'brock', rim: 'dark' } }).icons.rim).toBe('dark');
    expect(defineProduct({ ...BASE, icons: { brand: 'tessera', rim: 'light' } }).icons.rim).toBe('light');
  });

  it('sets no rim on another brand or without a brand', () => {
    expect(defineProduct({ ...BASE, icons: { brand: 'tessera' } }).icons).not.toHaveProperty('rim');
    expect(defineProduct(BASE).icons).toEqual({});
  });
});

describe('product.logos.app', () => {
  it('points a brand app at the 32 px icon the title bar draws', () => {
    expect(defineProduct({ ...BASE, icons: { brand: 'brock' } }).logos).toEqual({
      app: './logos/icon-32.png', instance: './logos/icon-bot.svg', mark: './logos/mark.svg',
    });
  });

  it('keeps the 256 px default without a brand and the logo an app names', () => {
    expect(defineProduct(BASE).logos.app).toBe('./logos/icon-256.png');
    expect(defineProduct({ ...BASE, icons: { brand: 'brock' }, logos: { app: './logos/own.png' } }).logos).toMatchObject({ app: './logos/own.png', instance: './logos/own.png' });
  });
});

describe('product.icons.wordmark', () => {
  it('takes a path and uses it on the dark ground too', () => {
    expect(defineProduct({ ...BASE, icons: { wordmark: './logos/wordmark.svg' } }).icons.wordmark).toEqual({ src: './logos/wordmark.svg', dark: './logos/wordmark.svg' });
  });

  it('keeps a dark ground variant beside the brand files', () => {
    const { icons } = defineProduct({ ...BASE, icons: { brand: 'brock', wordmark: { src: './logos/wordmark.png', dark: './logos/wordmark-dark.png' } } });
    expect(icons.wordmark).toEqual({ src: './logos/wordmark.png', dark: './logos/wordmark-dark.png' });
    expect(icons.rim).toBe('light');
  });

  it('keeps the pixelated rendering an app opts into, and drops auto', () => {
    expect(defineProduct({ ...BASE, icons: { wordmark: { src: './logos/wordmark.svg', rendering: 'pixelated' } } }).icons.wordmark)
      .toEqual({ src: './logos/wordmark.svg', dark: './logos/wordmark.svg', rendering: 'pixelated' });
    expect(defineProduct({ ...BASE, icons: { wordmark: { src: './logos/wordmark.svg', rendering: 'auto' } } }).icons.wordmark)
      .toEqual({ src: './logos/wordmark.svg', dark: './logos/wordmark.svg' });
  });

  it('refuses a rendering it does not know', () => {
    const wordmark = { src: './logos/wordmark.svg', rendering: 'auto' as const };
    Reflect.set(wordmark, 'rendering', 'crisp');
    expect(() => defineProduct({ ...BASE, icons: { wordmark } })).toThrow(/product\.icons\.wordmark\.rendering "crisp" must be one of auto, pixelated/);
  });

  it('sets no wordmark when the app names none', () => {
    expect(defineProduct(BASE).icons).not.toHaveProperty('wordmark');
    expect(defineProduct({ ...BASE, icons: { brand: 'brock' } }).icons).not.toHaveProperty('wordmark');
  });

  it('refuses a file that is not an SVG or a PNG, or one outside public/', () => {
    expect(() => defineProduct({ ...BASE, icons: { wordmark: './logos/wordmark.webp' } })).toThrow(/product\.icons\.wordmark ".\/logos\/wordmark\.webp" must be an \.svg or \.png/);
    expect(() => defineProduct({ ...BASE, icons: { wordmark: { src: './logos/w.svg', dark: '../w.svg' } } })).toThrow(/product\.icons\.wordmark\.dark/);
    expect(() => defineProduct({ ...BASE, icons: { wordmark: '' } })).toThrow(/product\.icons\.wordmark/);
  });
});
