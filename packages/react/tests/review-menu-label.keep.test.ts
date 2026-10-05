/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { labelOf } from '../src/review/menu/label-of';

const html = (markup: string): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = markup;
  return host.firstElementChild as HTMLElement;
};

describe('the review menu label', () => {
  it('reads the shown words of a confirm item, not the hidden copy that keeps its width', () => {
    const item = html('<button class="dropdown__item"><span class="dropdown__label dropdown__label--ask"><span aria-live="polite">Reset layout</span><span class="dropdown__label-room" aria-hidden="true">Click again to reset layout</span></span></button>');
    expect(labelOf(item)).toBe('Reset layout');
  });

  it('reads a parent item by its own label while its sub-menu, with a confirm item, is open inside it', () => {
    const parent = html('<div class="dropdown__item"><span class="dropdown__label">Widgets</span><div role="menu"><button class="dropdown__item"><span class="dropdown__label dropdown__label--ask"><span aria-live="polite">Reset layout</span></span></button></div></div>');
    expect(labelOf(parent)).toBe('Widgets');
  });
});
