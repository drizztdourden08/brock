/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProductConfig } from '@drizztdourden08/brock-core';
import { defineProduct } from '@drizztdourden08/brock-core';
import { BrockContext } from '../src/app/brock-context';
import type { BrockContextValue } from '../src/app/brock-context.type';
import { WindowMascot } from '../src/brand/WindowMascot';
import { besideSpot } from '../src/brand/WindowMascot/behavior/beside-spot';
import { DEFAULT_SEARCH_HINT, WALKER_GAP, WALKER_HALF } from '../src/brand/WindowMascot/WindowMascot.constants';
import { paletteChecks } from '../src/review/checks/mascot-palette-checks';
import { windowChecks } from '../src/review/checks/mascot-window-checks';
import { usePaletteStore } from '../src/palette/usePaletteStore';
import { ScreenLayer } from '../src/screens/ScreenLayer/ScreenLayer';
import { failed } from './review-outcomes';

const actor = { moveTo: vi.fn((..._args: unknown[]) => Promise.resolve('done')), play: vi.fn((..._args: unknown[]) => Promise.resolve('done')), autonomy: vi.fn() };
const stage = { actor: () => actor, stageX: (x: number) => x, width: () => 1000 };

vi.mock('@drizztdourden08/tessera/brand', async (original) => ({
  ...(await original<object>()),
  MascotStage: (props: { ref?: { current: unknown }; cast: readonly { brand: string }[] }) => {
    if (props.ref) props.ref.current = stage;
    return createElement('div', { 'data-stage': props.cast[0]?.brand });
  },
}));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const PRODUCT = defineProduct({ id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' }, icons: { brand: 'brock' } });
let root: Root | null = null;
let host: HTMLElement | null = null;

const context = (product: ProductConfig): BrockContextValue => ({ product } as BrockContextValue);

const layer = (product: ProductConfig) => createElement(BrockContext.Provider, { value: context(product) }, createElement(WindowMascot));

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = vi.fn(); });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const width = this.classList.contains('window-mascot__probe') ? 1000 : 0;
    return { left: 0, top: 0, width, height: 112, right: width, bottom: 112, x: 0, y: 0, toJSON: () => ({}) };
  });
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  document.querySelectorAll('.command-palette--open, #portal-root').forEach((el) => el.remove());
  usePaletteStore.getState().hide();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const show = (product: ProductConfig): void => {
  act(() => root?.render(layer(product)));
};

describe('the walking mascot', () => {
  it('is the brand mascot on a stage in the portal layer, with no pointer events or focus', () => {
    show(PRODUCT);
    const walker = document.querySelector('[data-window-mascot]');
    expect(walker?.getAttribute('data-window-mascot')).toBe('brock');
    expect(walker?.hasAttribute('inert')).toBe(true);
    expect(walker?.getAttribute('aria-hidden')).toBe('true');
    expect(walker?.querySelector('[data-stage="brock"]')).not.toBeNull();
  });

  it('draws nothing for a brand with no mascot, and nothing when product.mascot is false', () => {
    show(defineProduct({ id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } }));
    expect(document.querySelector('[data-window-mascot]')).toBeNull();
    show({ ...PRODUCT, mascot: false });
    expect(document.querySelector('[data-window-mascot]')).toBeNull();
  });

  it('walks beside the palette with its own moveTo, points, and shows the default search hint', () => {
    show(PRODUCT);
    const palette = document.createElement('div');
    palette.className = 'command-palette--open';
    palette.getBoundingClientRect = () => ({ left: 400, right: 600, top: 0, bottom: 300, width: 200, height: 300, x: 400, y: 0, toJSON: () => ({}) });
    document.body.append(palette);
    act(() => usePaletteStore.getState().show());
    expect(actor.autonomy).toHaveBeenLastCalledWith(false);
    expect(actor.moveTo).toHaveBeenCalledWith(400 - WALKER_GAP - WALKER_HALF, { face: 'right' });
    expect(document.querySelector('.window-mascot__hint')?.textContent).toContain(DEFAULT_SEARCH_HINT);
    act(() => usePaletteStore.getState().hide());
    expect(actor.autonomy).toHaveBeenLastCalledWith(true);
    expect(document.querySelector('.window-mascot__hint')).toBeNull();
  });

  it('says the product hint instead of the default', () => {
    show({ ...PRODUCT, mascot: { searchHint: 'Find a game' } });
    const palette = document.createElement('div');
    palette.className = 'command-palette--open';
    document.body.append(palette);
    act(() => usePaletteStore.getState().show());
    expect(document.querySelector('.window-mascot__hint')?.textContent).toContain('Find a game');
  });

  it('is not drawn by a window that is not shown', () => {
    const html = renderToStaticMarkup(createElement(ScreenLayer, { title: 'Credits', icon: null, hidden: true, onClose: () => undefined, children: 'x' }));
    expect(html).not.toContain('window-mascot');
  });
});

describe('where the mascot stands beside the palette', () => {
  it('stands left of the palette facing it, or right of it when the left has no room', () => {
    expect(besideSpot({ left: 400, right: 600, width: 1000 })).toEqual({ x: 400 - WALKER_GAP - WALKER_HALF, face: 'right' });
    expect(besideSpot({ left: 40, right: 240, width: 1000 })).toEqual({ x: 240 + WALKER_GAP + WALKER_HALF, face: 'left' });
  });

  it('keeps inside the stage when the palette fills it', () => {
    const spot = besideSpot({ left: 10, right: 390, width: 400 });
    expect(spot.x).toBeGreaterThanOrEqual(WALKER_HALF);
    expect(spot.x).toBeLessThanOrEqual(400 - WALKER_HALF);
  });
});

describe('the mascot review checks', () => {
  const box = (left: number, right: number, bottom: number) => ({ left, right, bottom });
  const reading = { card: box(0, 800, 600), walker: box(0, 800, 600), actor: box(100, 180, 600), palette: box(300, 500, 400), hint: 'Type to search' };

  it('pass for a mascot along the window bottom and beside the palette with a hint', () => {
    expect(failed([...windowChecks(reading), ...paletteChecks(reading)])).toEqual([]);
  });

  it('fail for a mascot off the bottom, over the palette or with no hint', () => {
    expect(failed(windowChecks({ ...reading, walker: box(0, 800, 300) }))).toEqual(['mascot-window-bottom']);
    expect(failed(paletteChecks({ ...reading, actor: box(280, 360, 600), hint: null }))).toEqual(['mascot-beside-palette', 'mascot-search-hint']);
  });
});
