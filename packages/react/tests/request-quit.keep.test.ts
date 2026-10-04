/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { quitGuards } from '../src/quit/quit-guards';
import { requestQuit } from '../src/quit/request-quit';
import { useDialogStore } from '../src/stores/useDialogStore';

const removers: (() => void)[] = [];

const guard = (message: string | null): void => { removers.push(quitGuards.add(() => message)); };

afterEach(() => {
  for (const remove of removers.splice(0)) remove();
  useDialogStore.setState({ dialog: null });
});

describe('requestQuit (beforeQuit)', () => {
  it('quits at once when no beforeQuit returns a message', async () => {
    guard(null);
    const quit = vi.fn();
    await expect(requestQuit(quit)).resolves.toBe(true);
    expect(quit).toHaveBeenCalledOnce();
    expect(useDialogStore.getState().dialog).toBeNull();
  });

  it('asks first when a beforeQuit returns a message, and quits on confirm', async () => {
    guard('A room is hosting');
    const quit = vi.fn();
    const asked = requestQuit(quit);
    const dialog = useDialogStore.getState().dialog;
    expect(dialog).toMatchObject({ message: 'A room is hosting', confirmLabel: 'Quit' });
    expect(quit).not.toHaveBeenCalled();
    dialog?.onConfirm();
    await expect(asked).resolves.toBe(true);
    expect(quit).toHaveBeenCalledOnce();
  });

  it('stays open when the confirm is cancelled', async () => {
    guard('A seed is generating');
    const quit = vi.fn();
    const asked = requestQuit(quit);
    useDialogStore.getState().dialog?.onCancel?.();
    await expect(asked).resolves.toBe(false);
    expect(quit).not.toHaveBeenCalled();
  });

  it('lists every message and stops asking a guard once it is removed', async () => {
    guard('A room is hosting');
    guard('A seed is generating');
    void requestQuit(vi.fn());
    expect(useDialogStore.getState().dialog?.message).toBe('A room is hosting\nA seed is generating');
    for (const remove of removers.splice(0)) remove();
    const quit = vi.fn();
    await requestQuit(quit);
    expect(quit).toHaveBeenCalledOnce();
  });
});
