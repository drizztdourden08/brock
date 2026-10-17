/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nav } from '../src/navigation/nav';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { screenScroll } from '../src/screens/scroll/screen-scroll';
import { scrollMarks } from '../src/screens/scroll/scroll-marks';

const frames: FrameRequestCallback[] = [];

const flushFrames = (): void => {
  for (let guard = 0; guard < 200 && frames.length > 0; guard += 1) frames.shift()?.(0);
};

const drawScreen = (id: string): HTMLElement => {
  const root = document.body.appendChild(document.createElement('div'));
  root.className = 'screen-window';
  root.innerHTML = `<div class="head"></div><div class="content"><div class="nav"></div><div class="pane"></div></div><span hidden data-screen-scroll="${id}"></span>`;
  return root;
};

const pane = (root: Element): HTMLElement => root.querySelector<HTMLElement>('.pane') ?? root as HTMLElement;

let stop: (() => void) | null = null;

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
  stop = screenScroll.watch();
});

afterEach(() => {
  stop?.();
  vi.unstubAllGlobals();
  frames.length = 0;
  document.body.innerHTML = '';
  useNavigationStore.getState().restore(null);
});

describe('scroll marks', () => {
  it('reads the scrolled elements of a screen by their place in it and puts the offsets back', () => {
    const root = drawScreen('game');
    pane(root).scrollTop = 240;
    const marks = scrollMarks.read(root);
    expect(marks).toEqual([{ path: [1, 1], top: 240, left: 0 }]);
    const again = drawScreen('game');
    expect(scrollMarks.apply(again, marks, true)).toEqual([]);
    expect(pane(again).scrollTop).toBe(240);
  });
});

describe('closing and reopening a window', () => {
  it('keeps the scroll of the window Escape closed and puts it back when Escape reopens it', () => {
    nav.open('game/saves');
    pane(drawScreen('game')).scrollTop = 180;
    nav.escape();
    document.body.innerHTML = '';
    nav.escape();
    const back = drawScreen('game');
    flushFrames();
    expect(useNavigationStore.getState().active).toBe('game');
    expect(pane(back).scrollTop).toBe(180);
  });

  it('leaves a window opened again from the menu at the top', () => {
    nav.open('game/saves');
    pane(drawScreen('game')).scrollTop = 180;
    nav.close();
    document.body.innerHTML = '';
    nav.open('game');
    const fresh = drawScreen('game');
    flushFrames();
    expect(pane(fresh).scrollTop).toBe(0);
  });
});
