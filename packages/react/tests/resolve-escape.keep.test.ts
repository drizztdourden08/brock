/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { escapeLayers } from '../src/escape/escape-layers';
import { resolveEscape } from '../src/escape/resolve-escape';

const NOTHING = { layerOpen: false, dialogOpen: false, screenOpen: false, homeAvailable: true };

describe('resolveEscape', () => {
  it('closes a registered layer before anything else', () => {
    expect(resolveEscape({ ...NOTHING, layerOpen: true, dialogOpen: true, screenOpen: true })).toBe('layer');
  });

  it('then the dialog, then the screen', () => {
    expect(resolveEscape({ ...NOTHING, dialogOpen: true, screenOpen: true })).toBe('dialog');
    expect(resolveEscape({ ...NOTHING, screenOpen: true })).toBe('screen');
  });

  it('opens home when nothing is open, and does nothing without a home', () => {
    expect(resolveEscape(NOTHING)).toBe('home');
    expect(resolveEscape({ ...NOTHING, homeAvailable: false })).toBe('none');
  });
});

describe('escapeLayers', () => {
  it('returns the last open layer and forgets a removed one', () => {
    const first = { isOpen: () => true, close: () => undefined };
    const closed = { isOpen: () => false, close: () => undefined };
    const removeFirst = escapeLayers.add(first);
    const removeClosed = escapeLayers.add(closed);
    expect(escapeLayers.topmost()).toBe(first);
    removeFirst();
    expect(escapeLayers.topmost()).toBeNull();
    removeClosed();
  });
});
