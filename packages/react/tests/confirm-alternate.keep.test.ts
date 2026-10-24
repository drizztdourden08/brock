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
  { value: 'a', label: 'Version A' },
  { value: 'b', label: 'Version B' },
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

describe('confirmAction alternate', () => {
  it('draws a neutral alternate as a secondary button, keeps the dialog open and calls onSelect', () => {
    mount();
    const onSelect = vi.fn();
    act(() => { void confirmAction({ title: 'Upgrade', message: 'A new build is ready.', confirmLabel: 'Upgrade', cancelLabel: 'Not now', alternate: { label: 'Release notes', onSelect } }); });
    const button = findButton('Release notes');
    expect(button?.className).toContain('secondary');
    expect(button?.className).not.toContain('danger');
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

  it('draws a danger alternate in the danger look when tone is danger', () => {
    mount();
    act(() => { void confirmAction({ title: 'Reset', message: 'x', alternate: { label: 'Wipe', onSelect: () => {}, tone: 'danger' } }); });
    expect(findButton('Wipe')?.className).toContain('danger');
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

describe('confirmChoice alternate', () => {
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

  it('resolves null and closes when closes is true', async () => {
    mount();
    let answer: Promise<string | null> | null = null;
    act(() => { answer = confirmChoice({ title: 'Pick', message: 'x', choices: CHOICES, initial: 'a', alternate: { label: 'Skip', closes: true, onSelect: () => {} } }); });
    clickButton('Skip');
    await expect(answer).resolves.toBeNull();
    expect(useDialogStore.getState().dialog).toBeNull();
  });
});

describe('confirmSave discard', () => {
  it('is still a danger button that closes the dialog and resolves discard', async () => {
    mount();
    let answer: Promise<string> | null = null;
    act(() => { answer = confirmSave({ title: 'Unsaved', message: 'x' }); });
    expect(findButton('Discard')?.className).toContain('danger');
    clickButton('Discard');
    await expect(answer).resolves.toBe('discard');
    expect(useDialogStore.getState().dialog).toBeNull();
  });
});
