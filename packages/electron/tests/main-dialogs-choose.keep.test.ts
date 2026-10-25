/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { automation, flags, log, parentOf, resetDialogs, showMessageBox } from './dialogs-fixture';
import { createDialogs } from '../src/main/dialogs/create-dialogs';

vi.mock('electron', async () => (await import('./electron-dialog-mock')).electronDialogMock);

const read = { id: 'read', label: 'Read only' };
const write = { id: 'write', label: 'Allow edits' };
const never = { id: 'never', label: 'Never' };
const choices = [read, write, never];
const options = { title: 'Pair it?', message: 'The assistant wants access.', choices, defaultId: 'read', cancelId: 'never' };
const dialogs = createDialogs({ flags, window: () => null, log });

beforeEach(resetDialogs);

describe('ctx.dialogs.choose', () => {
  it('shows the labels in order, with Enter on defaultId and Escape on cancelId', async () => {
    await dialogs.choose({ ...options, detail: 'Pick one.' });
    expect(showMessageBox).toHaveBeenCalledWith(
      expect.objectContaining({ buttons: ['Read only', 'Allow edits', 'Never'], defaultId: 0, cancelId: 2, detail: 'Pick one.' }),
    );
  });

  it('resolves the id of the clicked button', async () => {
    showMessageBox.mockResolvedValue({ response: 1 });
    expect(await dialogs.choose(options)).toBe('write');
  });

  it('resolves cancelId when the box is closed or Escape is pressed', async () => {
    showMessageBox.mockResolvedValue({ response: 2 });
    expect(await dialogs.choose(options)).toBe('never');
  });

  it('is parented to a visible main window and to nothing otherwise', async () => {
    const parent = parentOf({ visible: true, minimized: false, destroyed: false });
    await createDialogs({ flags, window: () => parent, log }).choose(options);
    expect(showMessageBox).toHaveBeenLastCalledWith(parent, expect.objectContaining({ title: 'Pair it?' }));
    const minimized = parentOf({ visible: true, minimized: true, destroyed: false });
    await createDialogs({ flags, window: () => minimized, log }).choose(options);
    expect(showMessageBox.mock.calls[1]).toHaveLength(1);
  });

  it('shows nothing on an automation launch and resolves cancelId, unless showOnAutomation is set', async () => {
    const hidden = createDialogs({ flags: automation, window: () => null, log });
    expect(await hidden.choose(options)).toBe('never');
    expect(showMessageBox).not.toHaveBeenCalled();
    expect(log.mock.calls[0]?.[0]).toContain('Pair it?');
    const noFocus = { ...automation, hasFlag: (flag: string) => flag === '--no-focus' };
    showMessageBox.mockResolvedValue({ response: 0 });
    expect(await createDialogs({ flags: noFocus, window: () => null, log }).choose({ ...options, showOnAutomation: true })).toBe('read');
  });

  it.each([
    ['one choice', { choices: [read], defaultId: 'read', cancelId: 'read' }, '2 to 4 choices'],
    ['five choices', { choices: [...choices, { id: 'a', label: 'A' }, { id: 'b', label: 'B' }] }, '2 to 4 choices'],
    ['duplicate ids', { choices: [read, read], defaultId: 'read', cancelId: 'read' }, 'duplicate'],
    ['an unknown defaultId', { defaultId: 'nope' }, 'defaultId "nope"'],
    ['an unknown cancelId', { cancelId: 'nope' }, 'cancelId "nope"'],
  ])('throws on %s, before anything is shown', async (_name, patch, message) => {
    await expect(dialogs.choose({ ...options, ...patch })).rejects.toThrow(message);
    await expect(createDialogs({ flags: automation, window: () => null, log }).choose({ ...options, ...patch })).rejects.toThrow(message);
    expect(showMessageBox).not.toHaveBeenCalled();
  });
});
