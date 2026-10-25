/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { Bar, drawOnPlatform } from './title-bar-fixtures';

const draw = (windowChrome: boolean): string => drawOnPlatform(createElement(Bar), windowChrome);

describe('the title bar on a host without window buttons', () => {
  it('draws the bar with no window control at all, close included', () => {
    const html = draw(false);
    expect(html).toContain('Demo');
    expect(html).not.toContain('window-title-bar__control');
    expect(html).not.toContain('window-title-bar__controls');
  });

  it('keeps the window controls, close included, where the host has window chrome', () => {
    const html = draw(true);
    expect(html).toContain('window-title-bar__control--close');
    expect(html).toContain('window-title-bar__controls');
  });
});
