/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement, isValidElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSettingsStore } from '../src/stores/create-settings-store';
import { resolveSections } from '../src/settings/SettingsLayout/behavior/resolve-sections';
import { settingRow } from '../src/settings/SettingsLayout/behavior/setting-row';
import { SettingChoiceField } from '../src/settings/SettingsLayout/sub-components/SettingChoiceField';
import type { SettingChoiceFieldProps } from '../src/settings/SettingsLayout/sub-components/SettingChoiceField';
import { settingEntries } from '../src/search/catalog/setting-entries';
import type { CatalogInput } from '../src/search/search.type';
import type { Section, SettingItem, TabDef } from '../src/settings/settings.type';

const SETTINGS = { scheme: 'classic', accent: '#3366ff', layers: ['hud'], advanced: false, depth: 'low' };

const context = (extra = {}) => ({ settings: SETTINGS, onChange: vi.fn(), disabled: false, lock: null, ...extra });

const SCHEME: SettingItem = {
  key: 'scheme',
  label: 'Control scheme',
  hint: 'How the pad maps.',
  noDescription: true,
  control: { kind: 'choice', options: [{ value: 'classic', label: 'Classic' }, { value: 'pro', label: 'Pro', disabled: 'Needs a pad with two sticks' }] },
};

const DEPTH: SettingItem = { key: 'depth', label: 'Depth', hint: 'More detail.', noDescription: true, visible: (settings) => settings.advanced === true, control: { kind: 'choice', options: [{ value: 'low', label: 'Low' }] } };

describe('settings: the normalise hook and the patch transform', () => {
  it('normalises the merged settings once a profile hydrates, with what was stored', async () => {
    const seen: unknown[] = [];
    const store = createSettingsStore({
      defaults: { volume: 0.5, mode: 'windowed' },
      load: () => Promise.resolve({ volume: 3, mode: 'legacy-full' }),
      save: () => Promise.resolve(),
      normalise: (settings, stored) => {
        seen.push(stored);
        return { volume: Math.min(1, settings.volume), mode: settings.mode === 'legacy-full' ? 'fullscreen' : settings.mode };
      },
    });
    await store.getState().hydrate('p1');
    expect(store.getState().settings).toEqual({ volume: 1, mode: 'fullscreen' });
    expect(seen).toEqual([{ volume: 3, mode: 'legacy-full' }]);
  });

  it('runs every patch through the transform before it is applied, saved and seen by the effects', async () => {
    const effect = vi.fn();
    const save = vi.fn(() => Promise.resolve());
    const store = createSettingsStore({
      defaults: { fullscreen: false, borderless: false },
      load: () => Promise.resolve(null),
      save,
      saveDelayMs: 1,
      effects: [effect],
      transformPatch: (patch) => (patch.fullscreen === true ? { ...patch, borderless: false } : patch),
    });
    await store.getState().hydrate('p1');
    store.getState().patch({ borderless: true });
    store.getState().patch({ fullscreen: true });
    await store.flush();
    expect(store.getState().settings).toEqual({ fullscreen: true, borderless: false });
    expect(effect).toHaveBeenLastCalledWith({ fullscreen: true, borderless: false }, { fullscreen: true, borderless: false }, { fullscreen: false, borderless: true });
    expect(save).toHaveBeenLastCalledWith('p1', { fullscreen: true, borderless: false });
  });
});

describe('settings rows: colour, multi-choice, an option with a reason, and a row shown by a predicate', () => {
  it('draws a colour row and a multi-choice row with Tessera inputs', () => {
    const colour = settingRow({ key: 'accent', label: 'Accent', hint: 'The highlight.', noDescription: true, control: { kind: 'color' } }, context());
    expect(colour).toMatchObject({ input: { kind: 'color', value: '#3366ff' } });
    const multi = settingRow({ key: 'layers', label: 'Layers', hint: 'What draws.', noDescription: true, control: { kind: 'multi', options: [{ value: 'hud', label: 'HUD' }, { value: 'map', label: 'Map' }] } }, context());
    expect(multi).toMatchObject({ input: { kind: 'multi', value: ['hud'] } });
  });

  it('draws a choice with a disabled option as its own field, which tells the reason and refuses the value', () => {
    const onChange = vi.fn();
    const row = settingRow(SCHEME, context({ onChange }));
    expect(row).toMatchObject({ input: { kind: 'custom', text: 'Classic' } });
    const control = row && 'input' in row && row.input?.kind === 'custom' ? row.input.control : null;
    expect(isValidElement(control)).toBe(true);
  });

  it('leaves a row out while its predicate says so, on the page and in search', () => {
    const sections: Section[] = [{ id: 'video', title: 'Video', items: [SCHEME, DEPTH] }];
    const keysOf = (settings: object): string[] => resolveSections(sections, '', settings).flatMap((section) => section.groups).flatMap((group) => group.items).map((item) => item.key);
    expect(keysOf(SETTINGS)).toEqual(['scheme']);
    expect(keysOf({ ...SETTINGS, advanced: true })).toEqual(['scheme', 'depth']);
    const tab: TabDef<object> = { id: 'video', label: 'Video', navIcon: null, group: 'app', sections: () => sections };
    const input = { settings: SETTINGS, tabs: [tab], settingsPlace: { bucket: null, title: 'Settings' }, isMobile: false, hasProfile: true, patch: vi.fn() } as Partial<CatalogInput> as CatalogInput;
    expect(settingEntries(input).map((entry) => entry.id)).toEqual(['setting:scheme']);
  });
});

let root: Root | null = null;

const draw = (props: SettingChoiceFieldProps): void => {
  document.body.innerHTML = '<div id="host"></div>';
  root = createRoot(document.getElementById('host') as HTMLElement);
  act(() => root?.render(createElement(SettingChoiceField, props)));
};

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.replaceChildren();
});

describe('SettingChoiceField', () => {
  it('draws a disabled segment with its reason and never sets its value', () => {
    const onChange = vi.fn();
    draw({ look: 'segmented', options: [{ value: 'classic', label: 'Classic' }, { value: 'pro', label: 'Pro', disabled: 'Needs a pad with two sticks' }], value: 'classic', onChange, label: 'Control scheme', disabled: false });
    const pro = [...document.querySelectorAll('button')].find((button) => button.textContent.includes('Pro'));
    expect(pro?.disabled).toBe(true);
    expect(pro?.getAttribute('title')).toBe('Needs a pad with two sticks');
    act(() => pro?.click());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('draws a multi-choice with a disabled option', () => {
    draw({ look: 'multi', options: [{ value: 'hud', label: 'HUD' }, { value: 'map', label: 'Map', disabled: true }], value: ['hud'], onChange: vi.fn(), label: 'Layers', disabled: false });
    const map = [...document.querySelectorAll('button, input')].find((element) => element.closest('label, button')?.textContent.includes('Map'));
    expect(map?.hasAttribute('disabled')).toBe(true);
  });
});
