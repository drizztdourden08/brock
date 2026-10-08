/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScreenWindow } from '@drizztdourden08/tessera/composites';
import { useEscapeStack } from '@drizztdourden08/tessera/primitives';
import type { EscapeLevel } from '@drizztdourden08/tessera/primitives';
import { handleShellKey } from '../src/app/BrockApp/behavior/handle-shell-key';
import { shellTakesEscape } from '../src/escape/shell-takes-escape';
import { nav } from '../src/navigation/nav';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { usePaletteShortcut } from '../src/palette/PaletteHost/behavior/usePaletteShortcut';
import { usePaletteStore } from '../src/palette/usePaletteStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

interface HarnessProps {
  screenClose: () => void;
  layer?: { level: EscapeLevel; onEscape: () => void };
  palette?: boolean;
}

const Shell = () => {
  const escapes = useEscapeStack();
  useEffect(() => {
    const root = document.documentElement;
    const handler = (event: KeyboardEvent): void => { handleShellKey(event, { home: () => null, escapes }); };
    root.addEventListener('keydown', handler);
    return () => root.removeEventListener('keydown', handler);
  }, [escapes]);
  return null;
};

const Layer = ({ level, onEscape }: { level: EscapeLevel; onEscape: () => void }) => {
  useEscapeStack({ level, onEscape });
  return null;
};

const Palette = () => {
  usePaletteShortcut();
  return null;
};

const Harness = ({ screenClose, layer, palette }: HarnessProps) => createElement('div', null,
  createElement(Shell),
  createElement(ScreenWindow, { title: 'Rooms', onClose: screenClose, children: createElement('p', null, 'Rooms') }),
  layer ? createElement(Layer, layer) : null,
  palette ? createElement(Palette) : null);

let root: Root | null = null;

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = '';
  useNavigationStore.getState().restore(null);
  usePaletteStore.getState().hide();
});

const mount = (props: HarnessProps): void => {
  const host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root?.render(createElement(Harness, props)));
};

const escape = (target: Element = document.body): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  act(() => { target.dispatchEvent(event); });
  return event;
};

describe('shellTakesEscape', () => {
  const stack = (top: EscapeLevel | null) => ({ depth: () => (top ? 1 : 0), top: () => top });
  it('takes Escape with nothing on the stack or only a screen, and leaves the rest to Tessera', () => {
    const free = { defaultPrevented: false };
    expect(shellTakesEscape(free, stack(null))).toBe(true);
    expect(shellTakesEscape(free, stack('screen'))).toBe(true);
    for (const level of ['dialog', 'menu', 'popover', 'drag'] as const) expect(shellTakesEscape(free, stack(level))).toBe(false);
    expect(shellTakesEscape({ defaultPrevented: true }, stack(null))).toBe(false);
  });
});

describe('Escape between the shell and Tessera\'s escape stack', () => {
  it('goes up a hub level once, through the shell, with the screen frame on the stack', () => {
    const screenClose = vi.fn();
    mount({ screenClose });
    nav.open('game');
    nav.open('game/saves');
    useNavigationStore.getState().setEscapeTo({});
    const event = escape(document.querySelector('.screen-window') ?? document.body);
    expect(event.defaultPrevented).toBe(true);
    expect(useNavigationStore.getState().active).toBe('game');
    expect(useNavigationStore.getState().params.section).toBeUndefined();
    expect(screenClose).not.toHaveBeenCalled();
  });

  it('would close the screen frame through Tessera alone, so the shell has to take the key first', () => {
    const screenClose = vi.fn();
    const host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
    act(() => root?.render(createElement(ScreenWindow, { title: 'Rooms', onClose: screenClose, children: 'Rooms' })));
    escape();
    expect(screenClose).toHaveBeenCalledTimes(1);
  });

  it('closes only a menu, a dialog or a popover above the screen', () => {
    for (const level of ['menu', 'dialog', 'popover'] as const) {
      const screenClose = vi.fn();
      const onEscape = vi.fn();
      mount({ screenClose, layer: { level, onEscape } });
      nav.open('rooms');
      escape();
      expect(onEscape).toHaveBeenCalledTimes(1);
      expect(screenClose).not.toHaveBeenCalled();
      expect(useNavigationStore.getState().active).toBe('rooms');
      act(() => root?.unmount());
    }
  });

  it('leaves a key an inner control consumed alone', () => {
    const screenClose = vi.fn();
    mount({ screenClose });
    nav.open('rooms');
    const field = document.createElement('div');
    field.addEventListener('keydown', (event) => event.preventDefault());
    document.querySelector('.screen-window')?.append(field);
    escape(field);
    expect(useNavigationStore.getState().active).toBe('rooms');
    expect(screenClose).not.toHaveBeenCalled();
  });

  it('closes the search palette on its own, and the screen under it stays', () => {
    const screenClose = vi.fn();
    mount({ screenClose, palette: true });
    nav.open('rooms');
    act(() => usePaletteStore.getState().show());
    escape();
    expect(usePaletteStore.getState().open).toBe(false);
    expect(useNavigationStore.getState().active).toBe('rooms');
    escape();
    expect(useNavigationStore.getState().active).toBeNull();
    expect(screenClose).not.toHaveBeenCalled();
  });
});
