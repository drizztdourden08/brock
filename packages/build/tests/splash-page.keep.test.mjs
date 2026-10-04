/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderSplashPage } from '../src/splash/render-splash-page.mjs';
import { SPLASH_SCRIPT } from '../src/splash/splash-script.mjs';

const OWN_STYLES = readFileSync(join(import.meta.dirname, '..', 'src', 'splash', 'splash-page.css'), 'utf8');

describe('the splash page', () => {
  it('draws its parts with the Tessera splash kit classes', () => {
    const html = renderSplashPage({ name: 'Brock', mark: 'mark.svg', styles: '' });
    for (const part of ['ts-splash', 'ts-stage', 'ts-title', 'ts-status', 'ts-actions', 'ts-button ts-button--primary', 'ts-version', 'ts-progress ts-progress--edge']) {
      expect(html).toContain(part);
    }
    expect(html).not.toMatch(/splash__(button|bar|fill|version|status|actions)/);
  });

  it('keeps only the layout, the mark and the look in its own stylesheet', () => {
    expect(OWN_STYLES).not.toMatch(/\.splash__(button|bar|fill|version|status|actions)\b/);
    expect(OWN_STYLES).toContain('.splash__mark');
  });

  it('fills the bar through --value and marks a failed start with the danger classes', () => {
    expect(SPLASH_SCRIPT).toContain("bar.style.setProperty('--value'");
    expect(SPLASH_SCRIPT).toContain("status.classList.add('ts-status--danger')");
    expect(SPLASH_SCRIPT).toContain("bar.classList.add('ts-progress--danger')");
  });
});
