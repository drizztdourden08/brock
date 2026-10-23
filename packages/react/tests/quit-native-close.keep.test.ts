/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { answerQuit } from '../src/quit/answer-quit';
import { quitGuards } from '../src/quit/quit-guards';
import { requestQuit } from '../src/quit/request-quit';
import { useDialogStore } from '../src/stores/useDialogStore';

const removers: (() => void)[] = [];

afterEach(() => {
  for (const remove of removers.splice(0)) remove();
  useDialogStore.setState({ dialog: null });
});

const register = (): { asyncGuard: ReturnType<typeof vi.fn> } => {
  const asyncGuard = vi.fn(() => 'quit' as const);
  removers.push(quitGuards.add(() => 'A room is hosting'), quitGuards.addAsync(asyncGuard));
  return { asyncGuard };
};

describe('the guard count the renderer reports to main', () => {
  it('counts sync and async guards and tells a subscriber on every change', () => {
    const listener = vi.fn();
    const stop = quitGuards.subscribe(listener);
    expect(quitGuards.count()).toBe(0);
    const removeSync = quitGuards.add(() => null);
    const removeAsync = quitGuards.addAsync(() => 'quit');
    expect(quitGuards.count()).toBe(2);
    removeSync();
    removeAsync();
    expect(quitGuards.count()).toBe(0);
    expect(listener).toHaveBeenCalledTimes(4);
    stop();
    quitGuards.add(() => null)();
    expect(listener).toHaveBeenCalledTimes(4);
  });
});

describe('a native close answered by the renderer', () => {
  it('asks the same dialog and runs the same guards as requestQuit', async () => {
    const { asyncGuard } = register();
    const viaMenu = requestQuit(vi.fn());
    const menuDialog = useDialogStore.getState().dialog;
    useDialogStore.getState().dialog?.onConfirm();
    await viaMenu;
    asyncGuard.mockClear();
    const viaNative = answerQuit();
    expect(useDialogStore.getState().dialog).toMatchObject({ title: menuDialog?.title, message: menuDialog?.message, confirmLabel: menuDialog?.confirmLabel });
    useDialogStore.getState().dialog?.onConfirm();
    await expect(viaNative).resolves.toBe('quit');
    expect(asyncGuard).toHaveBeenCalledOnce();
  });

  it('stays when the sync confirm is cancelled, without running the async guards', async () => {
    const { asyncGuard } = register();
    const viaNative = answerQuit();
    useDialogStore.getState().dialog?.onCancel?.();
    await expect(viaNative).resolves.toBe('stay');
    expect(asyncGuard).not.toHaveBeenCalled();
  });

  it('stays when an async guard says stay, and quits with no guard at all', async () => {
    removers.push(quitGuards.addAsync(() => 'stay'));
    await expect(answerQuit()).resolves.toBe('stay');
    removers.splice(0).forEach((remove) => remove());
    await expect(answerQuit()).resolves.toBe('quit');
  });
});
