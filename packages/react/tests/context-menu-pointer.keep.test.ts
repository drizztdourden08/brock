/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { blockContextMenus } from '../src/context-menu/block-context-menus';
import { listContextMenus } from '../src/context-menu/list-context-menus';
import { openContextMenu } from '../src/context-menu/open-context-menu';
import { useContextMenuStore } from '../src/context-menu/useContextMenuStore';
import { byId, contextmenu, item, mountMenus, openPoint, opened, pointer, ran, rerenderMenus, rightClick, seen, unmountMenus } from './context-menu-harness';

beforeEach(mountMenus);
afterEach(unmountMenus);

describe('opening with the pointer', () => {
  it('opens at the pointer, keeps the browser menu away and names the menu from the zone', () => {
    const event = rightClick(byId('canvas'), 40, 50);
    expect(event.defaultPrevented).toBe(true);
    expect(openPoint()).toEqual({ x: 40, y: 50 });
    expect(opened()?.label).toBe('Actions for {"sprite":4}');
    expect(item('Copy pixels')).toBeDefined();
  });

  it('leaves the browser menu where no app menu is declared, in a plain text field and in a native zone', () => {
    expect(contextmenu(byId('outside'), 40, 50).defaultPrevented).toBe(false);
    expect(rightClick(byId('plain'), 5, 5).defaultPrevented).toBe(false);
    expect(rightClick(byId('native'), 5, 5).defaultPrevented).toBe(false);
    expect(opened()).toBeNull();
  });

  it('opens in a text field that opts in', () => {
    expect(rightClick(byId('opted'), 6, 7).defaultPrevented).toBe(true);
    expect(openPoint()).toEqual({ x: 6, y: 7 });
  });

  it('gives the command the point, the target, the trigger, the zone data and the entry args', () => {
    rightClick(byId('canvas'), 40, 50);
    act(() => item('Copy pixels')?.click());
    expect(ran).toHaveLength(1);
    expect(ran[0]).toMatchObject({ point: { x: 40, y: 50 }, trigger: 'pointer', data: { sprite: 4 }, args: { mode: 'all' } });
    expect(ran[0]?.target).toBe(byId('canvas'));
    expect(opened()).toBeNull();
  });

  it('builds the entries once per open, not per render', () => {
    rightClick(byId('canvas'), 1, 1);
    rerenderMenus();
    expect(seen.builds).toBe(1);
  });
});

describe('veto, hooks and zones', () => {
  it('runs beforeOpen first and cancels when it returns false', () => {
    seen.allow = false;
    expect(rightClick(byId('canvas'), 1, 1).defaultPrevented).toBe(true);
    expect(seen.before).toHaveLength(1);
    expect(seen.builds).toBe(0);
    expect(opened()).toBeNull();
  });

  it('lets a zone veto the right click on pointerdown, so the tool keeps it', () => {
    seen.veto = true;
    expect(rightClick(byId('canvas'), 1, 1).defaultPrevented).toBe(true);
    expect(opened()).toBeNull();
  });

  it('opens on release without a drag when the zone asks, and not after a drag', () => {
    const target = byId('release');
    pointer('pointerdown', target, { button: 2, clientX: 10, clientY: 10 });
    expect(contextmenu(target, 10, 10).defaultPrevented).toBe(true);
    expect(opened()).toBeNull();
    pointer('pointerup', target, { button: 2, clientX: 60, clientY: 10 });
    expect(opened()).toBeNull();
    pointer('pointerdown', target, { button: 2, clientX: 10, clientY: 10 });
    pointer('pointerup', target, { button: 2, clientX: 12, clientY: 11 });
    expect(openPoint()).toEqual({ x: 12, y: 11 });
  });

  it('opens the innermost zone, and adds the parent only when the child asks', () => {
    rightClick(byId('row'), 1, 1);
    expect(opened()?.entries).toEqual(['canvas.front', 'separator', 'canvas.copy']);
    act(() => useContextMenuStore.getState().hide());
    rightClick(byId('list'), 1, 1);
    expect(opened()?.entries).toEqual(['canvas.copy']);
  });
});

describe('the open menu', () => {
  beforeEach(() => {
    rightClick(byId('canvas'), 40, 50);
  });

  it('draws separators, checked items, submenus and disabled items', () => {
    expect(document.querySelector('[role="separator"]')).not.toBeNull();
    expect(item('Show grid')?.getAttribute('aria-checked')).toBe('true');
    expect(item('Arrange')).toBeDefined();
    const off = item('Paste pixels');
    expect(off?.hasAttribute('disabled') === true || off?.getAttribute('aria-disabled') === 'true').toBe(true);
  });

  it('closes on resize and when the focus leaves', () => {
    act(() => { window.dispatchEvent(new Event('resize')); });
    expect(opened()).toBeNull();
    rightClick(byId('canvas'), 40, 50);
    act(() => byId('outside').focus());
    expect(opened()).toBeNull();
  });
});

describe('long press', () => {
  const touch = (type: string, x: number, y: number, pointerId = 1): void => {
    pointer(type, byId('canvas'), { pointerType: 'touch', pointerId, clientX: x, clientY: y });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('opens after the delay and is never vetoed', () => {
    seen.veto = true;
    touch('pointerdown', 20, 30);
    act(() => { vi.advanceTimersByTime(600); });
    expect(openPoint()).toEqual({ x: 20, y: 30 });
    expect(opened()?.context.trigger).toBe('longpress');
  });

  it('cancels on a move, on a second pointer and on a release', () => {
    touch('pointerdown', 20, 30);
    touch('pointermove', 80, 30);
    act(() => { vi.advanceTimersByTime(600); });
    touch('pointerdown', 20, 30);
    touch('pointerdown', 25, 30, 2);
    act(() => { vi.advanceTimersByTime(600); });
    touch('pointerdown', 20, 30);
    touch('pointerup', 20, 30);
    act(() => { vi.advanceTimersByTime(600); });
    expect(opened()).toBeNull();
  });
});

describe('blocking and helpers', () => {
  it('does not open while blocked or while a modal dialog is open, but keeps the browser menu away', () => {
    blockContextMenus(true);
    expect(rightClick(byId('canvas'), 1, 1).defaultPrevented).toBe(true);
    expect(opened()).toBeNull();
    blockContextMenus(false);
    document.body.insertAdjacentHTML('beforeend', '<div role="dialog" aria-modal="true"></div>');
    rightClick(byId('canvas'), 1, 1);
    expect(opened()).toBeNull();
  });

  it('opens a zone by id with data, without a pointer', () => {
    expect(openContextMenu('row', { id: 9 })).toBe(true);
    expect(opened()?.context.data).toEqual({ id: 9 });
    expect(openContextMenu('nowhere')).toBe(false);
  });

  it('lists every registered menu with its command ids and the ids that do not exist', () => {
    const canvas = listContextMenus().find((listed) => listed.zone === 'canvas');
    expect(canvas?.commands).toEqual(['canvas.copy', 'canvas.grid', 'canvas.front', 'missing.command', 'canvas.off']);
    expect(canvas?.missing).toEqual(['missing.command']);
  });

  it('marks the zone element as a menu opener and can make it focusable', () => {
    expect(byId('canvas').getAttribute('aria-haspopup')).toBe('menu');
    expect(byId('canvas').getAttribute('data-context-menu')).toBe('canvas');
    expect(byId('canvas').tabIndex).toBe(0);
  });
});
