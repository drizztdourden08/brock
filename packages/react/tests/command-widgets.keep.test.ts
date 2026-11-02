/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { findConflicts } from '../src/commands/find-conflicts';
import { useCommandStore } from '../src/commands/useCommandStore';
import { activeWidget } from '../src/widgets/active-widget/active-widget';
import { trackActiveWidget } from '../src/widgets/active-widget/track-active-widget';
import { useActiveWidgetStore } from '../src/widgets/active-widget/useActiveWidgetStore';
import { registerFresh } from './command-fixtures';

const press = (init: KeyboardEventInit): void => {
  document.addEventListener('keydown', (each) => dispatchCommand(each, null), { once: true });
  document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
};

const mount = (): { palette: HTMLElement; canvas: HTMLElement } => {
  document.body.replaceChildren();
  const palette = document.createElement('div');
  palette.setAttribute('data-widget-id', 'palette');
  const swatch = document.createElement('div');
  palette.append(swatch);
  const canvas = document.createElement('div');
  document.body.append(palette, canvas);
  return { palette: swatch, canvas };
};

const touch = (target: Element, type: 'pointerdown' | 'focusin' = 'pointerdown'): void => {
  target.dispatchEvent(new Event(type, { bubbles: true }));
};

describe('K1 active widget', () => {
  const ran: string[] = [];
  let unregister = (): void => {};
  let untrack = (): void => {};

  beforeEach(() => {
    ran.length = 0;
    useActiveWidgetStore.setState({ id: null, verify: true });
    unregister = registerFresh([
      { id: 'any-swap', label: 'Swap anywhere', chord: 'X', run: () => { ran.push('any-swap'); } },
      { id: 'palette-swap', label: 'Swap colours', chord: 'X', widget: 'palette', run: () => { ran.push('palette-swap'); } },
      { id: 'palette-only', label: 'Add swatch', chord: 'N', widget: 'palette', run: () => { ran.push('palette-only'); } },
    ]);
    untrack = trackActiveWidget(document);
  });

  afterEach(() => {
    untrack();
    unregister();
    document.body.replaceChildren();
  });

  it('fires a widget command after a press inside that widget', { tags: ['critical'] }, () => {
    const { palette } = mount();
    touch(palette);
    press({ key: 'n' });
    expect(ran).toEqual(['palette-only']);
  });

  it('holds a widget command after a press on the canvas', { tags: ['critical'] }, () => {
    const { palette, canvas } = mount();
    touch(palette);
    touch(canvas);
    press({ key: 'n' });
    expect(ran).toEqual([]);
  });

  it('ranks the widget command above the global one on the same chord', { tags: ['critical'] }, () => {
    const { palette, canvas } = mount();
    touch(palette);
    press({ key: 'x' });
    touch(canvas);
    press({ key: 'x' });
    expect(ran).toEqual(['palette-swap', 'any-swap']);
  });

  it('makes the widget active on focus as well as on a press', { tags: ['standard'] }, () => {
    const { palette } = mount();
    touch(palette, 'focusin');
    expect(activeWidget()).toBe('palette');
  });

  it('forgets the active widget once it is no longer drawn', { tags: ['standard'] }, () => {
    const { palette } = mount();
    touch(palette);
    document.body.replaceChildren();
    expect(activeWidget()).toBeNull();
  });

  it('keeps a popped window widget active only while its window has focus', { tags: ['standard'] }, () => {
    const stop = trackActiveWidget(document, 'palette');
    window.dispatchEvent(new Event('focus'));
    expect(activeWidget()).toBe('palette');
    window.dispatchEvent(new Event('blur'));
    expect(activeWidget()).toBeNull();
    stop();
  });

  it('reports no conflict between one chord with different widgets', { tags: ['critical'] }, () => {
    unregister();
    unregister = registerFresh([
      { id: 'a', label: 'A', chord: 'X', widget: 'palette', run: () => {} },
      { id: 'b', label: 'B', chord: 'X', widget: 'layers', run: () => {} },
    ]);
    expect(findConflicts(useCommandStore.getState())).toEqual([]);
  });
});
