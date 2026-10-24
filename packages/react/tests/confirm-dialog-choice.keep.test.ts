/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { ConfirmDialog } from '../src/shell/ConfirmDialog';
import { confirmAction } from '../src/stores/confirm-action';
import { confirmChoice } from '../src/stores/confirm-choice';
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

const clickButton = (label: string): void => {
  const button = [...document.querySelectorAll('button')].find((candidate) => candidate.textContent.trim() === label);
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

describe('confirmChoice look', () => {
  it('draws a radio group by default and resolves the picked value', async () => {
    mount();
    let answer: Promise<string | null> | null = null;
    act(() => { answer = confirmChoice({ title: 'Pick', message: 'One of them', choices: CHOICES, initial: 'a' }); });
    expect(document.querySelector('.radio-group')).not.toBeNull();
    expect(document.querySelector('[role="combobox"]')).toBeNull();
    act(() => useDialogStore.getState().choose('c'));
    clickButton('Confirm');
    await expect(answer).resolves.toBe('c');
  });

  it('draws a Select for look select, passes searchable on and resolves the picked value', async () => {
    mount();
    let answer: Promise<string | null> | null = null;
    act(() => { answer = confirmChoice({ title: 'Pick', message: 'One of them', choices: CHOICES, initial: 'b', look: 'select', searchable: true }); });
    expect(document.querySelector('.radio-group')).toBeNull();
    expect(useDialogStore.getState().dialog).toMatchObject({ look: 'select', searchable: true, choice: 'b' });
    const trigger = document.querySelector('[role="combobox"]');
    expect(trigger?.textContent).toContain('Version B');
    act(() => useDialogStore.getState().choose('c'));
    expect(document.querySelector('[role="combobox"]')?.textContent).toContain('Version C');
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
});

describe('confirm dialog facts', () => {
  it('draws the facts under the message, label beside value', () => {
    mount();
    act(() => {
      void confirmAction({ title: 'Install', message: 'Install this build?', facts: [{ label: 'Version', value: '0.9.2' }, { label: 'Size', value: '120 MB' }] });
    });
    const text = document.body.textContent;
    expect(text).toContain('Install this build?');
    expect(text.indexOf('Version')).toBeGreaterThan(text.indexOf('Install this build?'));
    expect(text).toContain('0.9.2');
    expect(text).toContain('Size');
    expect(text).toContain('120 MB');
    expect(document.querySelector('.facts-panel')).not.toBeNull();
  });

  it('draws facts together with a choice, and no panel without facts', () => {
    mount();
    act(() => {
      void confirmChoice({ title: 'Pick', message: 'x', choices: CHOICES, initial: 'a', look: 'select', facts: [{ label: 'Installed', value: '0.8.0' }] });
    });
    expect(document.querySelector('.facts-panel')?.textContent).toContain('0.8.0');
    expect(document.querySelector('[role="combobox"]')).not.toBeNull();
    act(() => useDialogStore.setState({ dialog: null }));
    act(() => { void confirmAction({ title: 'Plain', message: 'No facts' }); });
    expect(document.querySelector('.facts-panel')).toBeNull();
  });
});
