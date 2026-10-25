/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDialogs } from '../src/main/dialogs/create-dialogs';
import { automation, flags, log, parentOf, resetDialogs, showMessageBox } from './dialogs-fixture';

vi.mock('electron', async () => (await import('./electron-dialog-mock')).electronDialogMock);

const options = { title: 'Allow it?', message: 'A helper wants to act.' };

beforeEach(resetDialogs);

describe('ctx.dialogs.confirm', () => {
  it('resolves true on the confirm button and false on the cancel button', async () => {
    const dialogs = createDialogs({ flags, window: () => null, log });
    expect(await dialogs.confirm(options)).toBe(true);
    showMessageBox.mockResolvedValue({ response: 1 });
    expect(await dialogs.confirm(options)).toBe(false);
  });

  it('keeps Enter on the confirm button by default and moves it to cancel with defaultButton', async () => {
    const dialogs = createDialogs({ flags, window: () => null, log });
    await dialogs.confirm(options);
    expect(showMessageBox).toHaveBeenLastCalledWith(expect.objectContaining({ defaultId: 0, cancelId: 1 }));
    await dialogs.confirm({ ...options, defaultButton: 'cancel' });
    expect(showMessageBox).toHaveBeenLastCalledWith(expect.objectContaining({ defaultId: 1, cancelId: 1 }));
  });

  it('never counts Escape or a closed box as a confirm, even with the cancel button as default', async () => {
    showMessageBox.mockResolvedValue({ response: 1 });
    expect(await createDialogs({ flags, window: () => null, log }).confirm({ ...options, defaultButton: 'cancel' })).toBe(false);
  });

  it('is parented to the main window when it is visible', async () => {
    const parent = parentOf({ visible: true, minimized: false, destroyed: false });
    await createDialogs({ flags, window: () => parent, log }).confirm(options);
    expect(showMessageBox).toHaveBeenCalledWith(parent, expect.objectContaining({ title: 'Allow it?', message: 'A helper wants to act.' }));
  });

  it.each([
    ['hidden', { visible: false, minimized: false, destroyed: false }],
    ['minimized', { visible: true, minimized: true, destroyed: false }],
    ['destroyed', { visible: true, minimized: false, destroyed: true }],
  ])('is not parented when the main window is %s', async (_name, state) => {
    await createDialogs({ flags, window: () => parentOf(state), log }).confirm(options);
    expect(showMessageBox).toHaveBeenCalledTimes(1);
    expect(showMessageBox.mock.calls[0]).toHaveLength(1);
  });

  it('is not parented when there is no main window, as in a background launch', async () => {
    await createDialogs({ flags, window: () => null, log }).confirm(options);
    expect(showMessageBox.mock.calls[0]).toHaveLength(1);
  });

  it('passes the detail and the labels, with OK and Cancel as the defaults', async () => {
    const dialogs = createDialogs({ flags, window: () => null, log });
    await dialogs.confirm(options);
    expect(showMessageBox).toHaveBeenLastCalledWith(expect.objectContaining({ buttons: ['OK', 'Cancel'], defaultId: 0, cancelId: 1 }));
    await dialogs.confirm({ ...options, detail: 'It will read your notes.', confirmLabel: 'Allow', cancelLabel: 'Deny' });
    expect(showMessageBox).toHaveBeenLastCalledWith(expect.objectContaining({ detail: 'It will read your notes.', buttons: ['Allow', 'Deny'] }));
  });

  it('resolves false without showing anything on an automation launch, and logs it', async () => {
    const parent = parentOf({ visible: true, minimized: false, destroyed: false });
    expect(await createDialogs({ flags: automation, window: () => parent, log }).confirm(options)).toBe(false);
    expect(showMessageBox).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toContain('Allow it?');
  });

  it('shows the dialog on a plain --no-focus launch when showOnAutomation is set, and keeps the default false', async () => {
    const noFocus = ['node', 'app', '--no-focus'];
    const own = { ...flags, isAutomationLaunch: () => true, hasFlag: (flag: string) => noFocus.includes(flag) };
    const dialogs = createDialogs({ flags: own, window: () => null, log });
    expect(await dialogs.confirm({ ...options, showOnAutomation: true })).toBe(true);
    expect(showMessageBox).toHaveBeenCalledTimes(1);
    showMessageBox.mockClear();
    expect(await dialogs.confirm({ ...options, showOnAutomation: false })).toBe(false);
    expect(await dialogs.confirm(options)).toBe(false);
    expect(showMessageBox).not.toHaveBeenCalled();
  });

  it.each(['--review', '--review=boot', '--screenshot=boot', '--screenshot-splash=splash'])('stays refused on %s even with showOnAutomation', async (arg) => {
    const own = { ...flags, isAutomationLaunch: () => true, hasFlag: (flag: string) => arg === flag || arg.startsWith(`${flag}=`) };
    expect(await createDialogs({ flags: own, window: () => null, log }).confirm({ ...options, showOnAutomation: true })).toBe(false);
    expect(showMessageBox).not.toHaveBeenCalled();
  });
});
