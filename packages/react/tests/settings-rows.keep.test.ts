/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { getAppLog } from '../src/log/get-app-log';
import { dialogExtensions } from '../src/settings/SettingsLayout/sub-components/SettingPathField/behavior/dialog-extensions';
import { resolveSections } from '../src/settings/SettingsLayout/behavior/resolve-sections';
import { settingRow } from '../src/settings/SettingsLayout/behavior/setting-row';
import type { Section, SettingItem } from '../src/settings/settings.type';

const SETTINGS = { audio: true, mode: 'windowed', volume: 0.5 };

const context = (extra = {}) => ({ settings: SETTINGS, onChange: vi.fn(), disabled: false, lock: null, ...extra });

const AUDIO: SettingItem = { key: 'audio', label: 'Audio', description: 'Play sound.', hint: 'Off mutes every sound.' };

const MODE: SettingItem = {
  key: 'mode',
  label: 'Window mode',
  noDescription: true,
  hint: 'How the window sits on the screen.',
  control: { kind: 'choice', options: [{ value: 'windowed', label: 'Windowed', hint: 'A frame you can drag.' }] },
};

describe('K1 settingRow', { tags: ['critical'] }, () => {
  it('draws a toggle row with the description and the hint', () => {
    const onChange = vi.fn();
    const row = settingRow(AUDIO, context({ onChange }));
    expect(row).toMatchObject({ id: 'audio', title: 'Audio', description: 'Play sound.', hint: 'Off mutes every sound.', input: { kind: 'toggle', value: true } });
    if (row && 'input' in row && row.input?.kind === 'toggle') row.input.onChange(false);
    expect(onChange).toHaveBeenCalledWith({ audio: false });
  });

  it('draws a choice with more than three options as a select, and follows look', () => {
    const options = ['a', 'b', 'c', 'd'].map((value) => ({ value, label: value.toUpperCase() }));
    const item = (look?: 'segmented' | 'select' | 'radio'): SettingItem => ({ ...MODE, control: { kind: 'choice', options, look } });
    expect(settingRow(item(), context())).toMatchObject({ input: { kind: 'select' } });
    expect(settingRow(item('radio'), context())).toMatchObject({ input: { kind: 'radio' } });
    expect(settingRow(item('segmented'), context())).toMatchObject({ input: { kind: 'segmented' } });
  });

  it('maps the number, text, password, select, radio and tags controls to the SettingsRow inputs', () => {
    const settings = { port: 38281, host: 'local', secret: '', server: 'gg', side: 'left', words: ['a'] };
    const at = (key: string, control: SettingItem['control']) => settingRow({ ...AUDIO, key, control }, context({ settings }));
    expect(at('port', { kind: 'number', min: 1, max: 65535, step: 1, unit: 'port' })).toMatchObject({ input: { kind: 'number', value: 38281, min: 1, max: 65535, unit: 'port' } });
    expect(at('host', { kind: 'text', placeholder: 'Host' })).toMatchObject({ input: { kind: 'text', placeholder: 'Host' } });
    expect(at('secret', { kind: 'password' })).toMatchObject({ input: { kind: 'password', value: '' } });
    expect(at('server', { kind: 'select', options: [{ value: 'gg', label: 'GG' }], searchable: true })).toMatchObject({ input: { kind: 'select', searchable: true } });
    expect(at('side', { kind: 'radio', options: [{ value: 'left', label: 'Left' }] })).toMatchObject({ input: { kind: 'radio', value: 'left' } });
    expect(at('words', { kind: 'tags', suggestions: ['b'] })).toMatchObject({ input: { kind: 'tags', value: ['a'], suggestions: ['b'] } });
    expect(at('port', { kind: 'text' })).toBeNull();
  });

  it('warns once in development when a row resolves to no control', () => {
    const item: SettingItem = { ...AUDIO, key: 'mode' };
    const before = getAppLog().getEntries().length;
    expect(settingRow(item, context())).toBeNull();
    expect(settingRow(item, context())).toBeNull();
    const added = getAppLog().getEntries().slice(before);
    expect(added).toHaveLength(1);
    expect(added[0]).toMatchObject({ level: 'warn' });
    expect(added[0]?.message).toContain('Settings row "mode" draws nothing');
  });
});

describe('K1 a row drawn by renderControl', { tags: ['critical'] }, () => {
  it('keeps the title, description and hint on a renderControl row and draws the control in the control slot', () => {
    const row = settingRow(AUDIO, context({ renderControl: () => 'custom' }));
    expect(row).toMatchObject({ id: 'audio', title: 'Audio', description: 'Play sound.', hint: 'Off mutes every sound.', input: { kind: 'custom', control: 'custom' } });
    expect(row).not.toHaveProperty('content');
  });

  it('lets chrome: false give the whole row to renderControl, still carrying the hint for search', () => {
    const row = settingRow({ ...AUDIO, chrome: false }, context({ renderControl: () => 'custom' }));
    expect(row).toMatchObject({ id: 'audio', content: 'custom', hint: 'Off mutes every sound.' });
    expect(row).not.toHaveProperty('input');
  });

  it('falls through to the built-in control when renderControl returns null', () => {
    const row = settingRow(AUDIO, context({ renderControl: () => null }));
    expect(row).toMatchObject({ input: { kind: 'toggle' } });
  });
});

describe('K1 path and json controls', { tags: ['critical'] }, () => {
  it('turns accepted endings into the extensions of the native dialog', () => {
    expect(dialogExtensions(['.yaml', '*.yml', 'gb', '.'])).toEqual(['yaml', 'yml', 'gb']);
    expect(dialogExtensions(undefined)).toEqual([]);
  });
});

describe('K1 resolveSections', { tags: ['critical'] }, () => {
  const sections: Section[] = [{ id: 'window', title: 'Window', items: [AUDIO, MODE] }];

  it('matches a row by its hint and by the hint of an option', () => {
    expect(resolveSections(sections, 'mutes')[0]?.groups[0]?.items.map((item) => item.key)).toEqual(['audio']);
    expect(resolveSections(sections, 'drag')[0]?.groups[0]?.items.map((item) => item.key)).toEqual(['mode']);
  });

  it('searches a row that has no hint', () => {
    const bare: Section[] = [{ id: 'window', title: 'Window', items: [{ key: 'audio', label: 'Audio', description: 'Play sound.' }] }];
    expect(resolveSections(bare, 'sound')[0]?.groups[0]?.items.map((item) => item.key)).toEqual(['audio']);
    expect(resolveSections(bare, 'mutes')).toEqual([]);
  });
});
