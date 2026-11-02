/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { lookProperties } from '../src/splash/look-properties.mjs';
import { renderSplashPage } from '../src/splash/render-splash-page.mjs';
import { splashPlugin } from '../src/splash/splash-plugin.mjs';

describe('K4 the splash page', () => {
  it('escapes the app name in the title and the wordmark alt', { tags: ['critical'] }, () => {
    const html = renderSplashPage({ name: 'A & B', mark: 'mark.svg', styles: '', wordmark: './logos/wordmark-dark.svg' });
    expect(html).toContain('alt="A &amp; B"');
    expect(html).toContain('<title>A &amp; B</title>');
  });
});

describe('K1 the splash look', () => {
  it('gives the dark ground only to an app with colours of its own', { tags: ['critical'] }, () => {
    const look = { from: '#f5d76e', via: null, to: '#e8a33d', angle: 160, accent: '#e8a33d', ink: '#0e0f13', shade: '#f2f3f7' };
    expect(lookProperties(look)).not.toContain('--look-dark');
    const own = lookProperties(look, { from: '#2f2915', to: '#100b04' });
    expect(own).toContain('--look-dark-from: #2f2915;');
    expect(own).toContain('--look-dark-to: #100b04;');
  });
});

describe('K2 the splash plugin', () => {
  it('puts the look on the app page too, so the window draws its boot failure splash the same way', { tags: ['e2e'] }, async () => {
    const product = { id: 'look-check', name: 'Look check', appId: 'com.example.look-check', ports: { base: 35800 }, description: 'A test app.', author: { name: 'tester', email: 'tester@example.com' }, icons: { brand: 'brock' } };
    const plugin = splashPlugin({ rootDir: join(import.meta.dirname, '..', '..', '..', 'templates', 'app'), product });
    const [tag] = await plugin.transformIndexHtml();
    expect(tag).toMatchObject({ tag: 'style', attrs: { 'data-brock-look': '' }, injectTo: 'head' });
    expect(tag.children).toMatch(/--look-from: .+;/);
    expect(tag.children).toMatch(/--look-angle: \d+deg;/);
  });
});
