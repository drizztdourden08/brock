/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from '../src/shell/ConfirmDialog';
import { confirmAction } from '../src/stores/confirm-action';
import { confirmChoice } from '../src/stores/confirm-choice';
import { confirmSave } from '../src/stores/confirm-save';
import { useDialogStore } from '../src/stores/useDialogStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const CHOICES = [
  { value: 'a', label: 'Version A', description: 'The first' },
  { value: 'b', label: 'Version B' },
  { value: 'c', label: 'Version C' },
] as const;

let root: Root | null = null;

const mount = (): void => {
  const mounted = createRoot(document.body.appendChild(document.createElement('div')));
  root = mounted;
  act(() => mounted.render(createElement(ConfirmDialog)));
};

const findButton = (label: string): HTMLButtonElement | undefined =>
  [...document.querySelectorAll('button')].find((candidate) => candidate.textContent.trim() === label);

const clickButton = (label: string): void => {
  const button = findButton(label);
  act(() => { button?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
};

afterEach(() => {
  act(() => {
    useDialogStore.setState({ dialog: null });
    root?.unmount();
  });
  root = null;
  document.body.replaceChildren();
});

describe('S1 confirmChoice', { tags: ['standard'] }, () => {
  it('resolves the picked value', async () => {
    mount();
    let answer: Promise<string | null> | null = null;
    act(() => { answer = confirmChoice({ title: 'Pick', message: 'One of them', choices: CHOICES, initial: 'a' }); });
    act(() => useDialogStore.getState().choose('c'));
    clickButton('Confirm');
    await expect(answer).resolves.toBe('c');
  });

  it('resolves the initial value when nothing was changed, and null on cancel', async () => {
    mount();
    let kept: Promise<string | null> | null = null;
    act(() => { kept = confirmChoice({ title: 'Pick', message: 'x', choices: CHOICES, initial: 'b', look: 'select' }); });
    clickButton('Confirm');
    await expect(kept).resolves.toBe('b');
    let cancelled: Promise<string | null> | null = null;
    act(() => { cancelled = confirmChoice({ title: 'Pick', message: 'x', choices: CHOICES, initial: 'b', look: 'select' }); });
    act(() => useDialogStore.getState().dismiss());
    await expect(cancelled).resolves.toBeNull();
  });

  it('keeps the dialog open on a neutral alternate and resolves the picked value on confirm', async () => {
    mount();
    const onSelect = vi.fn();
    let answer: Promise<string | null> | null = null;
    act(() => { answer = confirmChoice({ title: 'Pick', message: 'x', choices: CHOICES, initial: 'a', alternate: { label: 'Notes', onSelect } }); });
    clickButton('Notes');
    expect(onSelect).toHaveBeenCalledOnce();
    expect(useDialogStore.getState().dialog).not.toBeNull();
    act(() => useDialogStore.getState().choose('b'));
    clickButton('Confirm');
    await expect(answer).resolves.toBe('b');
  });

  it('resolves null and closes when the alternate closes', async () => {
    mount();
    let answer: Promise<string | null> | null = null;
    act(() => { answer = confirmChoice({ title: 'Pick', message: 'x', choices: CHOICES, initial: 'a', alternate: { label: 'Skip', closes: true, onSelect: () => {} } }); });
    clickButton('Skip');
    await expect(answer).resolves.toBeNull();
    expect(useDialogStore.getState().dialog).toBeNull();
  });
});

describe('S1 confirmAction', { tags: ['standard'] }, () => {
  it('shows the facts under the message', () => {
    mount();
    act(() => {
      void confirmAction({ title: 'Install', message: 'Install this build?', facts: [{ label: 'Version', value: '0.9.2' }, { label: 'Size', value: '120 MB' }] });
    });
    const text = document.body.textContent;
    expect(text).toContain('Install this build?');
    expect(text).toContain('Version');
    expect(text).toContain('0.9.2');
    expect(text).toContain('Size');
    expect(text).toContain('120 MB');
  });

  it('keeps the dialog open on a neutral alternate and calls onSelect', () => {
    mount();
    const onSelect = vi.fn();
    act(() => { void confirmAction({ title: 'Upgrade', message: 'A new build is ready.', confirmLabel: 'Upgrade', cancelLabel: 'Not now', alternate: { label: 'Release notes', onSelect } }); });
    clickButton('Release notes');
    clickButton('Release notes');
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(useDialogStore.getState().dialog).not.toBeNull();
    expect(findButton('Upgrade')).toBeDefined();
  });

  it('still resolves true on confirm and false on cancel after the alternate was used', async () => {
    mount();
    let confirmed: Promise<boolean> | null = null;
    act(() => { confirmed = confirmAction({ title: 'Upgrade', message: 'x', confirmLabel: 'Upgrade', alternate: { label: 'Notes', onSelect: () => {} } }); });
    clickButton('Notes');
    clickButton('Upgrade');
    await expect(confirmed).resolves.toBe(true);
    let cancelled: Promise<boolean> | null = null;
    act(() => { cancelled = confirmAction({ title: 'Upgrade', message: 'x', alternate: { label: 'Notes', onSelect: () => {} } }); });
    clickButton('Notes');
    act(() => useDialogStore.getState().dismiss());
    await expect(cancelled).resolves.toBe(false);
  });

  it('closes the dialog and resolves false when closes is true, after onSelect ran', async () => {
    mount();
    const onSelect = vi.fn();
    let answer: Promise<boolean> | null = null;
    act(() => { answer = confirmAction({ title: 'Upgrade', message: 'x', alternate: { label: 'Later', closes: true, onSelect } }); });
    clickButton('Later');
    await expect(answer).resolves.toBe(false);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(useDialogStore.getState().dialog).toBeNull();
  });
});

describe('S1 confirmSave discard', { tags: ['standard'] }, () => {
  it('closes the dialog and resolves discard', async () => {
    mount();
    let answer: Promise<string> | null = null;
    act(() => { answer = confirmSave({ title: 'Unsaved', message: 'x' }); });
    clickButton('Discard');
    await expect(answer).resolves.toBe('discard');
    expect(useDialogStore.getState().dialog).toBeNull();
  });
});
