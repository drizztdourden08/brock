/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { quitGuards } from '../src/quit/quit-guards';
import { requestQuit } from '../src/quit/request-quit';
import { saveBeforeQuit } from '../src/quit/save-before-quit';
import type { OnBeforeQuit } from '../src/quit/quit.type';
import { useDialogStore } from '../src/stores/useDialogStore';

const toast = vi.hoisted(() => vi.fn());

vi.mock('../src/toast/toast', () => ({ toast }));

const removers: (() => void)[] = [];

const guard = (fn: OnBeforeQuit): void => { removers.push(quitGuards.addAsync(fn)); };

const tick = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, 0); });

afterEach(() => {
  for (const remove of removers.splice(0)) remove();
  useDialogStore.setState({ dialog: null });
  toast.mockReset();
});

describe('an async beforeQuit guard', () => {
  it('quits when no guard is registered', async () => {
    await expect(quitGuards.decide()).resolves.toBe('quit');
  });

  it('quits when every guard answers quit, and stays at the first stay', async () => {
    const second = vi.fn(() => 'quit' as const);
    guard(() => 'stay');
    guard(second);
    await expect(quitGuards.decide()).resolves.toBe('stay');
    expect(second).not.toHaveBeenCalled();
    for (const remove of removers.splice(0)) remove();
    guard(() => Promise.resolve('quit'));
    await expect(quitGuards.decide()).resolves.toBe('quit');
  });

  it('stays open when a guard throws or rejects', async () => {
    guard(() => { throw new Error('boom'); });
    await expect(quitGuards.decide()).resolves.toBe('stay');
    for (const remove of removers.splice(0)) remove();
    guard(() => Promise.reject(new Error('no disk')));
    await expect(quitGuards.decide()).resolves.toBe('stay');
  });

  it('runs the guards once for a second request made while the first is open', async () => {
    let finish: (value: 'quit') => void = () => undefined;
    const slow = vi.fn(() => new Promise<'quit'>((resolve) => { finish = resolve; }));
    guard(slow);
    const first = quitGuards.decide();
    const second = quitGuards.decide();
    expect(slow).toHaveBeenCalledOnce();
    finish('quit');
    await expect(Promise.all([first, second])).resolves.toEqual(['quit', 'quit']);
    expect(slow).toHaveBeenCalledOnce();
    removers.splice(0).forEach((remove) => remove());
    guard(() => 'stay');
    await expect(quitGuards.decide()).resolves.toBe('stay');
  });

});

describe('requestQuit with an async beforeQuit guard', () => {
  it('holds requestQuit until the guard answers, and quits on quit', async () => {
    let finish: (value: 'quit') => void = () => undefined;
    guard(() => new Promise<'quit'>((resolve) => { finish = resolve; }));
    const quit = vi.fn();
    const asked = requestQuit(quit);
    await tick();
    expect(quit).not.toHaveBeenCalled();
    finish('quit');
    await expect(asked).resolves.toBe(true);
    expect(quit).toHaveBeenCalledOnce();
  });

  it('keeps the window open through requestQuit on stay', async () => {
    guard(() => 'stay');
    const quit = vi.fn();
    await expect(requestQuit(quit)).resolves.toBe(false);
    expect(quit).not.toHaveBeenCalled();
  });

  it('asks the sync guards first, then the async ones', async () => {
    removers.push(quitGuards.add(() => 'A room is hosting'));
    const asyncGuard = vi.fn(() => 'quit' as const);
    guard(asyncGuard);
    const quit = vi.fn();
    const asked = requestQuit(quit);
    expect(asyncGuard).not.toHaveBeenCalled();
    useDialogStore.getState().dialog?.onConfirm();
    await expect(asked).resolves.toBe(true);
    expect(asyncGuard).toHaveBeenCalledOnce();
    removers.splice(0).forEach((remove) => remove());
  });
});

describe('saveBeforeQuit', () => {
  const answer = async (pick: 'save' | 'discard' | 'cancel', decided: Promise<unknown>): Promise<void> => {
    await tick();
    const dialog = useDialogStore.getState().dialog;
    expect(dialog).toMatchObject({ title: 'Save changes?', confirmLabel: 'Save', cancelLabel: 'Cancel', alternate: { label: 'Discard' } });
    if (pick === 'save') dialog?.onConfirm();
    else if (pick === 'discard') dialog?.alternate?.onSelect();
    else useDialogStore.getState().dismiss();
    await decided;
  };

  it('quits without a dialog when nothing is dirty', async () => {
    const save = vi.fn();
    await expect(saveBeforeQuit({ dirty: () => false, save })()).resolves.toBe('quit');
    expect(useDialogStore.getState().dialog).toBeNull();
    expect(save).not.toHaveBeenCalled();
  });

  it('saves, then quits', async () => {
    const save = vi.fn(() => Promise.resolve());
    const decided = Promise.resolve(saveBeforeQuit({ dirty: () => true, save })());
    await answer('save', decided);
    await expect(decided).resolves.toBe('quit');
    expect(save).toHaveBeenCalledOnce();
  });

  it('discards without saving, then quits', async () => {
    const save = vi.fn();
    const decided = Promise.resolve(saveBeforeQuit({ dirty: () => true, save })());
    await answer('discard', decided);
    await expect(decided).resolves.toBe('quit');
    expect(save).not.toHaveBeenCalled();
  });

  it('stays on cancel without saving', async () => {
    const save = vi.fn();
    const decided = Promise.resolve(saveBeforeQuit({ dirty: () => true, save })());
    await answer('cancel', decided);
    await expect(decided).resolves.toBe('stay');
    expect(save).not.toHaveBeenCalled();
  });

  it('stays open and says so when the save throws', async () => {
    const decided = Promise.resolve(saveBeforeQuit({ dirty: () => true, save: () => Promise.reject(new Error('disk full')) })());
    await answer('save', decided);
    await expect(decided).resolves.toBe('stay');
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('stays open'), { variant: 'danger' });
  });

  it('stays open when the save answers false', async () => {
    const decided = Promise.resolve(saveBeforeQuit({ dirty: () => true, save: () => Promise.resolve(false) })());
    await answer('save', decided);
    await expect(decided).resolves.toBe('stay');
  });

  it('takes its own wording', async () => {
    const decided = Promise.resolve(saveBeforeQuit({ dirty: () => true, save: () => Promise.resolve(), title: 'Save sprite?', saveLabel: 'Save sprite', discardLabel: 'Do not save' })());
    await tick();
    expect(useDialogStore.getState().dialog).toMatchObject({ title: 'Save sprite?', confirmLabel: 'Save sprite', alternate: { label: 'Do not save' } });
    useDialogStore.getState().dismiss();
    await expect(decided).resolves.toBe('stay');
  });
});
