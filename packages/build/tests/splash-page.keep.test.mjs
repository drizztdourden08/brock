/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { lookProperties } from '../src/splash/look-properties.mjs';
import { renderSplashPage } from '../src/splash/render-splash-page.mjs';
import { SPLASH_SCRIPT } from '../src/splash/splash-script.mjs';
import { splashPlugin } from '../src/splash/splash-plugin.mjs';

const OWN_STYLES = readFileSync(join(import.meta.dirname, '..', 'src', 'splash', 'splash-page.css'), 'utf8');

describe('the splash page', () => {
  it('draws its parts with the Tessera splash kit classes', () => {
    const html = renderSplashPage({ name: 'Brock', mark: 'mark.svg', styles: '' });
    for (const part of ['ts-splash', 'ts-stage', 'ts-title', 'ts-status', 'ts-actions', 'ts-button ts-button--primary', 'ts-version', 'ts-progress ts-progress--edge']) {
      expect(html).toContain(part);
    }
    expect(html).not.toMatch(/splash__(button|bar|fill|version|status|actions)/);
  });

  it('draws the mark in ts-mark and the failure message in ts-detail, as Tessera Splash does', () => {
    const html = renderSplashPage({ name: 'Brock', mark: 'mark.svg', styles: '' });
    expect(html).toContain('class="ts-mark splash__mark"');
    expect(html).toContain('<p class="ts-detail" id="splash-message"></p>');
    expect(html).not.toContain('splash__message');
  });

  it('puts the look on the app page too, so the window draws its boot failure splash the same way', async () => {
    const product = { id: 'look-check', name: 'Look check', appId: 'com.example.look-check', ports: { base: 35800 }, description: 'A test app.', author: { name: 'tester', email: 'tester@example.com' }, icons: { brand: 'brock' } };
    const plugin = splashPlugin({ rootDir: join(import.meta.dirname, '..', '..', '..', 'templates', 'app'), product });
    const [tag] = await plugin.transformIndexHtml();
    expect(tag).toMatchObject({ tag: 'style', attrs: { 'data-brock-look': '' }, injectTo: 'head' });
    expect(tag.children).toMatch(/--look-from: .+;/);
    expect(tag.children).toMatch(/--look-angle: \d+deg;/);
  }, 60_000);

  it('keeps only the layout and the entrance in its own stylesheet, so Tessera paints the dark ground and its tested text', () => {
    expect(OWN_STYLES).not.toMatch(/\.splash__(button|bar|fill|version|status|actions)\b/);
    expect(OWN_STYLES).toContain('.splash__mark');
    expect(OWN_STYLES).not.toMatch(/radial-gradient|drop-shadow|--look-(from|via|to|ink|shade)\b/);
    expect(OWN_STYLES).not.toMatch(/(^|\n)\s*(background|color)\s*:/);
  });

  it('gives the dark ground only to an app with colours of its own', () => {
    const look = { from: '#f5d76e', via: null, to: '#e8a33d', angle: 160, accent: '#e8a33d', ink: '#0e0f13', shade: '#f2f3f7' };
    expect(lookProperties(look)).not.toContain('--look-dark');
    const own = lookProperties(look, { from: '#2f2915', to: '#100b04' });
    expect(own).toContain('--look-dark-from: #2f2915;');
    expect(own).toContain('--look-dark-to: #100b04;');
  });

  it('leaves the dark ground to the Tessera palette for a branded app', async () => {
    const product = { id: 'look-check', name: 'Look check', appId: 'com.example.look-check', ports: { base: 35800 }, description: 'A test app.', author: { name: 'tester', email: 'tester@example.com' }, icons: { brand: 'brock' } };
    const plugin = splashPlugin({ rootDir: join(import.meta.dirname, '..', '..', '..', 'templates', 'app'), product });
    const [tag] = await plugin.transformIndexHtml();
    expect(tag.children).not.toContain('--look-dark');
    const own = splashPlugin({ rootDir: join(import.meta.dirname, '..', '..', '..', 'templates', 'app'), product: { ...product, look: { gradient: ['#f5d76e', '#e8a33d'] } } });
    const [ownTag] = await own.transformIndexHtml();
    expect(ownTag.children).toMatch(/--look-dark-from: #[0-9a-f]{6};/);
  }, 60_000);

  it('fills the bar through --value and marks a failed start with the danger classes', () => {
    expect(SPLASH_SCRIPT).toContain("bar.style.setProperty('--value'");
    expect(SPLASH_SCRIPT).toContain("status.classList.add('ts-status--danger')");
    expect(SPLASH_SCRIPT).toContain("bar.classList.add('ts-progress--danger')");
  });
});
