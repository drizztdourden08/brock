/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { focusRegion } from '../src/regions/focus-region';

describe('K2 the shell landmarks', { tags: ['critical'] }, () => {
  it('marks an app region as a labelled region with its id', () => {
    expect(focusRegion('canvas', 'Sprite canvas')).toEqual({ 'data-focus-region': 'canvas', role: 'region', 'aria-label': 'Sprite canvas' });
  });

  it('keeps the role an app asks for', () => {
    expect(focusRegion('canvas', 'Sprite canvas', { role: 'application' }).role).toBe('application');
  });
});
