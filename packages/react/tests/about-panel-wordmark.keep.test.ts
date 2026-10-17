/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AboutPanel } from '../src/compounds/AboutPanel';

const ROWS = [{ label: 'Version', value: '1.0.0' }];

const heading = (html: string): string => html.match(/<h2[^>]*>(.*?)<\/h2>/s)?.[1] ?? '';

describe('AboutPanel wordmark', () => {
  it('shows the wordmark image as the heading, with the name as its alt text', () => {
    const html = renderToStaticMarkup(createElement(AboutPanel, { title: 'My App', wordmark: './logos/wordmark.svg', rows: ROWS }));
    expect(heading(html)).toMatch(/<img[^>]*alt="My App"[^>]*src="\.\/logos\/wordmark\.svg"/);
    expect(heading(html)).toContain('about-panel__wordmark-image');
  });

  it('gives the heading the full panel width, so the image fits it however wide it is', () => {
    const html = renderToStaticMarkup(createElement(AboutPanel, { title: 'My App', wordmark: './logos/wordmark.svg', rows: ROWS }));
    expect(html).toContain('<div class="about-panel about-panel--wordmark"');
    expect(html).toMatch(/<h2[^>]*class="[^"]*about-panel__title--image/);
    const text = renderToStaticMarkup(createElement(AboutPanel, { title: 'My App', rows: ROWS }));
    expect(text).not.toContain('about-panel--wordmark');
    expect(text).not.toContain('about-panel__title--image');
  });

  it('scales the image with hard pixel edges only when the rendering is pixelated', () => {
    const smooth = renderToStaticMarkup(createElement(AboutPanel, { title: 'My App', wordmark: './logos/wordmark.svg', rows: ROWS }));
    expect(heading(smooth)).not.toContain('image--pixelated');
    const pixelated = renderToStaticMarkup(createElement(AboutPanel, { title: 'My App', wordmark: './logos/wordmark.png', wordmarkRendering: 'pixelated', rows: ROWS }));
    expect(heading(pixelated)).toContain('image--pixelated');
  });

  it('puts the wordmark image ahead of the brand wordmark', () => {
    const html = renderToStaticMarkup(createElement(AboutPanel, { title: 'Brock', brand: 'brock', wordmark: './logos/wordmark.png', rows: ROWS }));
    expect(heading(html)).toContain('src="./logos/wordmark.png"');
    expect(heading(html)).not.toContain('brand-wordmark');
  });

  it('keeps the name as text without a wordmark or a brand', () => {
    const html = renderToStaticMarkup(createElement(AboutPanel, { title: 'My App', rows: ROWS }));
    expect(heading(html)).toBe('My App');
  });
});
