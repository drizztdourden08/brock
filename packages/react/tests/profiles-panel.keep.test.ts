/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProfilesPanel } from '../src/compounds/ProfilesPanel';
import type { ProfilesPanelItem } from '../src/compounds/ProfilesPanel';

interface HarnessProps {
  start: ProfilesPanelItem[];
  failWith?: string;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const TWO_PROFILES: ProfilesPanelItem[] = [{ id: 'p1', name: 'Mira' }, { id: 'p2', name: 'Second run' }];
const THREE_PROFILES: ProfilesPanelItem[] = [...TWO_PROFILES, { id: 'p3', name: 'Third run' }];

const Harness = ({ start, failWith, onSelect, onDelete }: HarnessProps) => {
  const [profiles, setProfiles] = useState(start);
  const [selected, setSelected] = useState<string | null>(start[0]?.id ?? null);
  const create = (name: string): Promise<void> => {
    if (failWith) return Promise.reject(new Error(failWith));
    const id = `p${String(profiles.length + 1)}`;
    setProfiles((list) => [...list, { id, name }]);
    setSelected(id);
    return Promise.resolve();
  };
  return createElement(ProfilesPanel, {
    title: profiles.length ? 'Pick a profile, or create another' : 'Create a profile to get started',
    profiles,
    selectedId: selected,
    onSelect: (id: string) => { onSelect?.(id); setSelected(id); },
    onCreate: create,
    onRename: () => Promise.resolve(),
    onDelete,
    createOpen: profiles.length === 0,
  });
};

let root: Root | null = null;
let host: HTMLElement | null = null;

const settle = () => act(async () => { await new Promise((resolve) => { setTimeout(resolve, 40); }); });

const mount = async (props: HarnessProps): Promise<HTMLElement> => {
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => { root?.render(createElement(Harness, props)); });
  await settle();
  return host;
};

const nameInput = (): HTMLInputElement | null => document.querySelector('.inline-create-form input');

const buttonNamed = (name: string): HTMLButtonElement | undefined => [...document.querySelectorAll('button')]
  .find((button) => button.textContent.trim() === name || button.getAttribute('aria-label') === name);

const rowOf = (name: string): HTMLElement | undefined => [...document.querySelectorAll<HTMLElement>('.list-item-row__main')]
  .find((row) => row.textContent.includes(name));

const press = async (target: HTMLElement | null | undefined) => {
  act(() => { target?.click(); });
  await settle();
};

const ACTIVATING_KEYS = new Set(['Enter', ' ']);

const key = async (target: HTMLElement | null | undefined, name: string) => {
  act(() => {
    const kept = target?.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
    if (kept && target instanceof HTMLButtonElement && ACTIVATING_KEYS.has(name)) target.click();
  });
  await settle();
};

const typeName = (value: string) => {
  const input = nameInput();
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  act(() => {
    if (input) setValue?.call(input, value);
    input?.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  root = null;
  host = null;
});

describe('ProfilesPanel create form', () => {
  it('opens the first run form with focus in the name, no Cancel and no way out by Escape, and lands on the new row after the create', async () => {
    await mount({ start: [] });
    expect(document.body.textContent).toContain('Create a profile to get started');
    expect(document.activeElement).toBe(nameInput());
    expect(buttonNamed('Cancel')).toBeUndefined();
    await key(nameInput(), 'Escape');
    expect(nameInput()).not.toBeNull();
    typeName('Mira');
    await press(buttonNamed('Create'));
    expect(nameInput()).toBeNull();
    expect(rowOf('Mira')?.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(rowOf('Mira'));
  });

  it('opens the form from New with focus in the name, goes back to New on Cancel and Escape, and lands on the new row after the create', async () => {
    await mount({ start: [{ id: 'p1', name: 'Mira', aside: 'today' }] });
    await press(buttonNamed('New profile'));
    expect(document.activeElement).toBe(nameInput());
    expect(buttonNamed('New profile')).toBeUndefined();
    await press(buttonNamed('Cancel'));
    expect(nameInput()).toBeNull();
    expect(document.activeElement).toBe(buttonNamed('New profile'));
    await press(buttonNamed('New profile'));
    await key(nameInput(), 'Escape');
    expect(nameInput()).toBeNull();
    expect(document.activeElement).toBe(buttonNamed('New profile'));
    await press(buttonNamed('New profile'));
    typeName('Second run');
    await press(buttonNamed('Create'));
    expect(nameInput()).toBeNull();
    expect(rowOf('Second run')?.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(rowOf('Second run'));
  });

  it('keeps the form open with the message of a failed create', async () => {
    await mount({ start: [{ id: 'p1', name: 'Mira' }], failWith: 'A profile named Mira exists.' });
    await press(buttonNamed('New profile'));
    typeName('Mira');
    await press(buttonNamed('Create'));
    expect(nameInput()).not.toBeNull();
    expect(document.querySelector('[role="alert"]')?.textContent).toBe('A profile named Mira exists.');
  });
});

describe('ProfilesPanel rows', () => {
  it('deletes a profile that is not the active one with the mouse, without switching to it', async () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();
    await mount({ start: TWO_PROFILES, onSelect, onDelete });
    expect(buttonNamed('Rename Second run')).toBeDefined();
    await press(buttonNamed('Delete Second run'));
    await press(buttonNamed('Delete'));
    expect(onDelete).toHaveBeenCalledWith('p2');
    expect(onSelect).not.toHaveBeenCalled();
    expect(rowOf('Mira')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('moves focus with the arrow keys, Home and End without switching profile', async () => {
    const onSelect = vi.fn();
    await mount({ start: THREE_PROFILES, onSelect });
    rowOf('Mira')?.focus();
    await key(rowOf('Mira'), 'ArrowDown');
    expect(document.activeElement).toBe(rowOf('Second run'));
    await key(rowOf('Second run'), 'End');
    expect(document.activeElement).toBe(rowOf('Third run'));
    await key(rowOf('Third run'), 'Home');
    expect(document.activeElement).toBe(rowOf('Mira'));
    await key(rowOf('Mira'), 'ArrowDown');
    expect(onSelect).not.toHaveBeenCalled();
    expect(rowOf('Mira')?.getAttribute('aria-pressed')).toBe('true');
    expect(rowOf('Second run')?.getAttribute('aria-pressed')).toBe('false');
    expect(rowOf('Second run')?.tabIndex).toBe(0);
    expect(rowOf('Mira')?.tabIndex).toBe(-1);
  });

  it('switches profile on Enter or a press on a row', async () => {
    const onSelect = vi.fn();
    await mount({ start: THREE_PROFILES, onSelect });
    rowOf('Mira')?.focus();
    await key(rowOf('Mira'), 'ArrowDown');
    await key(rowOf('Second run'), 'Enter');
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('p2');
    expect(rowOf('Second run')?.getAttribute('aria-pressed')).toBe('true');
    await press(rowOf('Third run'));
    expect(onSelect).toHaveBeenLastCalledWith('p3');
    expect(rowOf('Third run')?.getAttribute('aria-pressed')).toBe('true');
  });
});
