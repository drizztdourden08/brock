/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { focusRegion } from '../src/regions/focus-region';
import { SHELL_LABELS } from '../src/regions/regions.constants';
import { Bar, drawOnPlatform } from './title-bar-fixtures';

describe('the shell landmarks', () => {
  it('wraps the title bar in one labelled banner', () => {
    const html = drawOnPlatform(createElement(Bar));
    expect(html.match(/role="banner"/g)).toHaveLength(1);
    expect(html).toContain(`aria-label="${SHELL_LABELS.titleBar}"`);
    expect(html.indexOf('role="banner"')).toBeLessThan(html.indexOf('window-title-bar'));
  });

  it('names the screen rail with the shell label', () => {
    expect(SHELL_LABELS.screens).toBe('Screens');
  });

  it('marks an app region as a labelled region with its id', () => {
    expect(focusRegion('canvas', 'Sprite canvas')).toEqual({ 'data-focus-region': 'canvas', role: 'region', 'aria-label': 'Sprite canvas' });
  });
});
