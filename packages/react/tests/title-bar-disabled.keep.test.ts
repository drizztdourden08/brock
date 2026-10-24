/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { act, createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { actionCommands } from '../src/title-bar/action-commands';
import { useCommandEnabled } from '../src/commands/useCommandEnabled';
import { useCommandGates } from '../src/commands/useCommandGates';
import { useCommandStore } from '../src/commands/useCommandStore';
import { useCommands } from '../src/commands/useCommands';
import { toBarAction } from '../src/title-bar/to-bar-action';
import { withActionState } from '../src/title-bar/with-action-state';

const flag = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
const buttonOf = (action: WindowTitleBarAction): Extract<WindowTitleBarAction, { onSelect: () => void }> => {
  if (!('onSelect' in action)) throw new Error('a button has onSelect');
  return action;
};

describe('a title bar button with a disabled state', () => {
  it('keeps an explicit disabled on the bar action and ignores clicks', () => {
    const onSelect = vi.fn();
    const action = toBarAction('undo', { kind: 'button', label: 'Undo', icon: 'send', onSelect, disabled: true });
    expect(action).toMatchObject({ id: 'undo', disabled: true });
    const guarded = buttonOf(withActionState(action, () => true));
    expect(guarded).toMatchObject({ disabled: true });
    guarded.onSelect();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('hands disabledReason to Tessera on a button and keeps it through the guard', () => {
    const action = toBarAction('undo-reason', { kind: 'button', label: 'Undo', icon: 'send', onSelect: vi.fn(), disabled: true, disabledReason: 'Nothing to undo' });
    expect(action).toMatchObject({ disabled: true, disabledReason: 'Nothing to undo' });
    expect(withActionState(action, () => true)).toMatchObject({ disabled: true, disabledReason: 'Nothing to undo' });
  });

  it('hands disabled and disabledReason to Tessera on a status', () => {
    const action = toBarAction('sync-state', { kind: 'status', label: 'Sync', icon: 'server', status: 'Offline', disabled: true, disabledReason: 'No connection' });
    expect(action).toMatchObject({ bar: 'status', disabled: true, disabledReason: 'No connection' });
  });

  it('leaves an enabled button alone', () => {
    const onSelect = vi.fn();
    const action = toBarAction('redo', { kind: 'button', label: 'Redo', icon: 'send', onSelect });
    expect(withActionState(action, () => true)).toBe(action);
  });

  it('disables a button whose command is not enabled', () => {
    const onSelect = vi.fn();
    actionCommands.link('undo-linked', 'doc.undo');
    const action = toBarAction('undo-linked', { kind: 'button', label: 'Undo', icon: 'send', onSelect, command: 'doc.undo' });
    expect(withActionState(action, () => true)).toBe(action);
    const guarded = buttonOf(withActionState(action, (id) => id !== 'doc.undo'));
    expect(guarded).toMatchObject({ disabled: true });
    guarded.onSelect();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('ignores a dropdown', () => {
    const action = toBarAction('rooms', { kind: 'menu', label: 'Rooms', icon: 'server', items: [{ key: 'new', label: 'New room' }] });
    expect(withActionState(action, () => false)).toBe(action);
  });
});

describe('the enabled state of a command', () => {
  let host: HTMLElement;
  let root: ReturnType<typeof createRoot>;
  const seen: boolean[] = [];
  let setUndoable: (value: boolean) => void = () => undefined;

  const Registrar = () => {
    const [undoable, set] = useState(false);
    setUndoable = set;
    useCommands([{ id: 'doc.undo', label: 'Undo', when: () => undoable, run: () => undefined }]);
    return null;
  };

  const Reader = () => {
    const enabled = useCommandEnabled();
    seen.push(enabled('doc.undo'));
    return null;
  };

  beforeEach(() => {
    flag.IS_REACT_ACT_ENVIRONMENT = true;
    seen.length = 0;
    useCommandStore.setState({ sources: [], overrides: {}, mac: false, persist: null });
    useCommandGates.setState({ gates: {} });
    host = document.createElement('div');
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
  });

  it('follows the when of the command and re-renders when it changes', () => {
    act(() => root.render(createElement('div', null, createElement(Registrar), createElement(Reader))));
    expect(seen.at(-1)).toBe(false);
    act(() => setUndoable(true));
    expect(seen.at(-1)).toBe(true);
    act(() => setUndoable(false));
    expect(seen.at(-1)).toBe(false);
  });

  it('treats a command with no when, and an unknown command, as enabled', () => {
    const Plain = () => {
      useCommands([{ id: 'doc.undo', label: 'Undo', run: () => undefined }]);
      return null;
    };
    act(() => root.render(createElement('div', null, createElement(Plain), createElement(Reader))));
    expect(seen.at(-1)).toBe(true);
  });

  it('drops the gates of a command source when it unmounts', () => {
    act(() => root.render(createElement('div', null, createElement(Registrar), createElement(Reader))));
    expect(Object.keys(useCommandGates.getState().gates)).toHaveLength(1);
    act(() => root.render(createElement(Reader)));
    expect(useCommandGates.getState().gates).toEqual({});
    expect(seen.at(-1)).toBe(true);
  });
});
