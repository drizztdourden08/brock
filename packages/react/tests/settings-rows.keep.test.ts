/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
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

describe('settingRow', () => {
  it('draws a toggle row with the description and the hint', () => {
    const onChange = vi.fn();
    const row = settingRow(AUDIO, context({ onChange }));
    expect(row).toMatchObject({ id: 'audio', title: 'Audio', description: 'Play sound.', hint: 'Off mutes every sound.', input: { kind: 'toggle', value: true } });
    if (row && 'input' in row && row.input.kind === 'toggle') row.input.onChange(false);
    expect(onChange).toHaveBeenCalledWith({ audio: false });
  });

  it('keeps noDescription and draws a choice as a segmented input with its hints', () => {
    const row = settingRow(MODE, context());
    expect(row).toMatchObject({ noDescription: true, hint: 'How the window sits on the screen.', input: { kind: 'segmented', options: MODE.control?.kind === 'choice' ? MODE.control.options : [] } });
    expect(row).not.toHaveProperty('description');
  });

  it('puts a custom control in a content row that still carries the hint for search', () => {
    const row = settingRow(AUDIO, context({ renderControl: () => 'custom' }));
    expect(row).toMatchObject({ id: 'audio', content: 'custom', hint: 'Off mutes every sound.' });
  });
});

describe('resolveSections', () => {
  const sections: Section[] = [{ id: 'window', title: 'Window', items: [AUDIO, MODE] }];

  it('matches a row by its hint and by the hint of an option', () => {
    expect(resolveSections(sections, 'mutes')[0]?.groups[0]?.items.map((item) => item.key)).toEqual(['audio']);
    expect(resolveSections(sections, 'drag')[0]?.groups[0]?.items.map((item) => item.key)).toEqual(['mode']);
  });
});
