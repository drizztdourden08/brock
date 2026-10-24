/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import { createDialogs } from '../src/main/dialogs/create-dialogs';

const shared = vi.hoisted(() => ({ showMessageBox: vi.fn() }));

vi.mock('electron', () => ({ dialog: { showMessageBox: shared.showMessageBox } }));

interface FakeParent {
  visible: boolean;
  minimized: boolean;
  destroyed: boolean;
}

const parentOf = ({ visible, minimized, destroyed }: FakeParent): never =>
  ({ isVisible: () => visible, isMinimized: () => minimized, isDestroyed: () => destroyed }) as never;

const flags = createAutomationFlags();
const automation = { ...flags, isAutomationLaunch: () => true };
const log = vi.fn();
const options = { title: 'Allow it?', message: 'A helper wants to act.' };

beforeEach(() => {
  shared.showMessageBox.mockReset();
  shared.showMessageBox.mockResolvedValue({ response: 0 });
  log.mockClear();
});

describe('ctx.dialogs.confirm', () => {
  it('resolves true on the confirm button and false on the cancel button', async () => {
    const dialogs = createDialogs({ flags, window: () => null, log });
    expect(await dialogs.confirm(options)).toBe(true);
    shared.showMessageBox.mockResolvedValue({ response: 1 });
    expect(await dialogs.confirm(options)).toBe(false);
  });

  it('is parented to the main window when it is visible', async () => {
    const parent = parentOf({ visible: true, minimized: false, destroyed: false });
    await createDialogs({ flags, window: () => parent, log }).confirm(options);
    expect(shared.showMessageBox).toHaveBeenCalledWith(parent, expect.objectContaining({ title: 'Allow it?', message: 'A helper wants to act.' }));
  });

  it.each([
    ['hidden', { visible: false, minimized: false, destroyed: false }],
    ['minimized', { visible: true, minimized: true, destroyed: false }],
    ['destroyed', { visible: true, minimized: false, destroyed: true }],
  ])('is not parented when the main window is %s', async (_name, state) => {
    await createDialogs({ flags, window: () => parentOf(state), log }).confirm(options);
    expect(shared.showMessageBox).toHaveBeenCalledTimes(1);
    expect(shared.showMessageBox.mock.calls[0]).toHaveLength(1);
  });

  it('is not parented when there is no main window, as in a background launch', async () => {
    await createDialogs({ flags, window: () => null, log }).confirm(options);
    expect(shared.showMessageBox.mock.calls[0]).toHaveLength(1);
  });

  it('passes the detail and the labels, with OK and Cancel as the defaults', async () => {
    const dialogs = createDialogs({ flags, window: () => null, log });
    await dialogs.confirm(options);
    expect(shared.showMessageBox).toHaveBeenLastCalledWith(expect.objectContaining({ buttons: ['OK', 'Cancel'], defaultId: 0, cancelId: 1 }));
    await dialogs.confirm({ ...options, detail: 'It will read your notes.', confirmLabel: 'Allow', cancelLabel: 'Deny' });
    expect(shared.showMessageBox).toHaveBeenLastCalledWith(expect.objectContaining({ detail: 'It will read your notes.', buttons: ['Allow', 'Deny'] }));
  });

  it('resolves false without showing anything on an automation launch, and logs it', async () => {
    const parent = parentOf({ visible: true, minimized: false, destroyed: false });
    expect(await createDialogs({ flags: automation, window: () => parent, log }).confirm(options)).toBe(false);
    expect(shared.showMessageBox).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toContain('Allow it?');
  });
});
