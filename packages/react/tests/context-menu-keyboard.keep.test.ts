/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commands } from '../src/commands/commands';
import { BROCK_COMMANDS } from '../src/commands/commands.constants';
import { closeContextMenu } from '../src/context-menu/close-context-menu';
import { useContextMenuStore } from '../src/context-menu/useContextMenuStore';
import { byId, item, mountMenus, openPoint, opened, press, rectOf, seen, unmountMenus } from './context-menu-harness';

beforeEach(mountMenus);
afterEach(unmountMenus);

describe('opening with the keyboard', () => {
  it('opens at the focused element on Shift+F10 and on the Menu key', () => {
    rectOf('list', 10, 70).focus();
    expect(press({ key: 'F10', shiftKey: true }).defaultPrevented).toBe(true);
    expect(openPoint()).toEqual({ x: 10, y: 70 });
    expect(opened()?.context.trigger).toBe('keyboard');
    act(() => useContextMenuStore.getState().hide());
    press({ key: 'ContextMenu' });
    expect(openPoint()).toEqual({ x: 10, y: 70 });
  });

  it('asks the zone for its anchor and data, and is never vetoed', () => {
    seen.veto = true;
    byId('canvas').focus();
    press({ key: 'F10', shiftKey: true });
    expect(openPoint()).toEqual({ x: 3, y: 4 });
    expect(opened()?.context.data).toEqual({ cell: 9 });
  });

  it('follows a rebound chord', () => {
    commands.remap(BROCK_COMMANDS.contextMenu, ['Alt+M']);
    rectOf('list', 10, 70).focus();
    press({ key: 'F10', shiftKey: true });
    expect(opened()).toBeNull();
    press({ key: 'm', altKey: true });
    expect(openPoint()).toEqual({ x: 10, y: 70 });
  });

  it('leaves the native menu to a plain text field and to focus outside every menu', () => {
    byId('plain').focus();
    expect(press({ key: 'F10', shiftKey: true }).defaultPrevented).toBe(false);
    byId('outside').focus();
    expect(press({ key: 'ContextMenu' }).defaultPrevented).toBe(false);
    expect(opened()).toBeNull();
  });

  it('opens from a text field that opts in', () => {
    byId('opted').focus();
    expect(press({ key: 'F10', shiftKey: true }).defaultPrevented).toBe(true);
    expect(opened()).not.toBeNull();
  });

  it('returns focus to the element that had it when the menu closes', () => {
    rectOf('list', 10, 70).focus();
    press({ key: 'F10', shiftKey: true });
    act(() => item('Copy pixels')?.focus());
    expect(document.activeElement).not.toBe(byId('list'));
    act(() => closeContextMenu());
    expect(document.activeElement).toBe(byId('list'));
    expect(opened()).toBeNull();
  });
});
