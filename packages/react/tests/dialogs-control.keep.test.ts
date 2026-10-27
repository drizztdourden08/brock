/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { confirmAction } from '../src/stores/confirm-action';
import { confirmChoice } from '../src/stores/confirm-choice';
import { confirmSave } from '../src/stores/confirm-save';
import { dialogs } from '../src/stores/dialogs';
import { useDialogStore } from '../src/stores/useDialogStore';

const CHOICES = [
  { value: 'a', label: 'Version A' },
  { value: 'b', label: 'Version B', description: 'The second' },
] as const;

afterEach(() => {
  useDialogStore.setState({ dialog: null });
});

describe('dialogs.current', () => {
  it('is null with no dialog open', () => {
    expect(dialogs.current()).toBeNull();
  });

  it('describes an open confirm with its answers', () => {
    void confirmAction({ title: 'Delete it', message: 'This cannot be undone', confirmLabel: 'Delete', variant: 'danger' });
    expect(dialogs.current()).toMatchObject({
      title: 'Delete it',
      message: 'This cannot be undone',
      variant: 'danger',
      choices: [{ id: 'confirm', label: 'Delete', kind: 'confirm' }, { id: 'cancel', label: 'Cancel', kind: 'cancel' }],
    });
  });

  it('lists the options of a choice dialog and its alternate', () => {
    void confirmChoice({ title: 'Pick', message: 'One', choices: CHOICES, initial: 'a', alternate: { label: 'Skip', onSelect: () => undefined } });
    const view = dialogs.current();
    expect(view?.selected).toBe('a');
    expect(view?.choices.map((choice) => choice.id)).toEqual(['option:a', 'option:b', 'confirm', 'alternate', 'cancel']);
  });

  it('keeps the same id while the dialog stays open and changes it for the next one', () => {
    void confirmChoice({ title: 'Pick', message: 'One', choices: CHOICES, initial: 'a' });
    const first = dialogs.current()?.id;
    useDialogStore.getState().choose('b');
    expect(dialogs.current()?.id).toBe(first);
    void confirmAction({ title: 'Next', message: 'Two' });
    expect(dialogs.current()?.id).not.toBe(first);
  });
});

describe('dialogs.answer', () => {
  it('confirms a plain confirm and resolves it true', async () => {
    const answer = confirmAction({ title: 'Go', message: 'Sure?' });
    expect(dialogs.answer('confirm')).toMatchObject({ ok: true, choice: 'confirm' });
    await expect(answer).resolves.toBe(true);
    expect(dialogs.current()).toBeNull();
  });

  it('cancels and resolves false', async () => {
    const answer = confirmAction({ title: 'Go', message: 'Sure?' });
    expect(dialogs.answer('cancel')).toMatchObject({ ok: true });
    await expect(answer).resolves.toBe(false);
    expect(dialogs.current()).toBeNull();
  });

  it('picks an option of a choice dialog and confirms it', async () => {
    const answer = confirmChoice({ title: 'Pick', message: 'One', choices: CHOICES, initial: 'a' });
    expect(dialogs.answer('option:b')).toMatchObject({ ok: true, choice: 'option:b' });
    await expect(answer).resolves.toBe('b');
  });

  it('runs the alternate of a save prompt', async () => {
    const answer = confirmSave({ title: 'Unsaved', message: 'Save first?' });
    expect(dialogs.answer('alternate')).toMatchObject({ ok: true });
    await expect(answer).resolves.toBe('discard');
  });

  it('rejects an unknown choice and leaves the dialog open', () => {
    void confirmAction({ title: 'Go', message: 'Sure?' });
    expect(dialogs.answer('maybe')).toMatchObject({ ok: false, why: 'unknown' });
    expect(dialogs.current()).not.toBeNull();
  });

  it('rejects an answer when nothing is open', () => {
    expect(dialogs.answer('confirm')).toMatchObject({ ok: false, why: 'none' });
  });
});
