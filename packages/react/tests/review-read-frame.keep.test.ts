/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { readFrame } from '../src/review/steps/read-frame';

afterEach(() => {
  document.body.replaceChildren();
});

const layer = (inner: string): void => {
  document.body.innerHTML = `<div class="screen-layer"><div class="screen-layer__frame" role="dialog" ${inner}</div></div>`;
};

describe('readFrame title', () => {
  it('reads the header title first', () => {
    document.body.innerHTML = '<div class="screen-layer"><div role="dialog" aria-label="Label"><div class="screen-window__header"><span class="window-header__title">Header</span></div></div></div>';
    expect(readFrame().title).toBe('Header');
  });

  it('reads aria-label when there is no header', () => {
    layer('aria-label="Labelled">');
    expect(readFrame().title).toBe('Labelled');
  });

  it('reads the text of the aria-labelledby elements', () => {
    layer('aria-labelledby="first second"><span id="first">Game</span><span id="second">options</span>');
    expect(readFrame().title).toBe('Game options');
  });

  it('reads the corner chip of a bare cornerTitle window', () => {
    layer('><div class="screen-window__corner-title"><span class="screen-window__corner-icon" aria-hidden="true">i</span><span class="screen-window__corner-text">Profiles</span></div>');
    expect(readFrame().title).toBe('Profiles');
  });

  it('reads the labelledby text before the corner chip', () => {
    layer('aria-labelledby="name"><span id="name">Named</span><span class="screen-window__corner-text">Chip</span>');
    expect(readFrame().title).toBe('Named');
  });

  it('is null when nothing names the window', () => {
    layer('>');
    expect(readFrame().title).toBeNull();
  });
});
