/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { settingRow } from '../src/settings/SettingsLayout/behavior/setting-row';
import type { SettingItem } from '../src/settings/settings.type';

const DEFAULTS = { audio: true, volume: 0.5, video: { fps: 60, vsync: true } };

const AUDIO: SettingItem = { key: 'audio', label: 'Audio', description: 'Play sound.' };
const FPS: SettingItem = { key: 'video.fps', label: 'Frame rate', description: 'Frames per second.', control: { kind: 'number' } };
const EXTRA: SettingItem = { key: 'extra', label: 'Extra', description: 'No default.' };

const context = (settings: object, extra = {}) => ({ settings, defaults: DEFAULTS, onChange: vi.fn(), disabled: false, lock: null, ...extra });

describe('settingRow reset', () => {
  it('marks a row changed only when the value differs from its default', () => {
    expect(settingRow(AUDIO, context({ ...DEFAULTS }))).toMatchObject({ changed: false });
    expect(settingRow(AUDIO, context({ ...DEFAULTS, audio: false }))).toMatchObject({ changed: true });
  });

  it('restores one key and leaves the others to the store', () => {
    const onChange = vi.fn();
    const row = settingRow(AUDIO, context({ ...DEFAULTS, audio: false, volume: 0.9 }, { onChange }));
    (row && 'onReset' in row ? row.onReset : undefined)?.();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ audio: true });
  });

  it('restores a nested key and keeps its siblings', () => {
    const onChange = vi.fn();
    const settings = { ...DEFAULTS, video: { fps: 30, vsync: false } };
    const row = settingRow(FPS, context(settings, { onChange, renderControl: () => 'x' }));
    expect(row).toMatchObject({ changed: true });
    (row && 'onReset' in row ? row.onReset : undefined)?.();
    expect(onChange).toHaveBeenCalledWith({ video: { fps: 60, vsync: false } });
  });

  it('gives a locked row neither', () => {
    const row = settingRow(AUDIO, context({ ...DEFAULTS, audio: false }, { lock: 'Managed.' }));
    expect(row).not.toHaveProperty('changed');
    expect(row).not.toHaveProperty('onReset');
  });

  it('gives a row with no default neither', () => {
    const row = settingRow(EXTRA, context({ ...DEFAULTS, extra: true }));
    expect(row).not.toHaveProperty('changed');
    expect(row).not.toHaveProperty('onReset');
  });

  it('gives a row neither when no defaults are given', () => {
    const row = settingRow(AUDIO, context({ ...DEFAULTS, audio: false }, { defaults: undefined }));
    expect(row).not.toHaveProperty('changed');
    expect(row).not.toHaveProperty('onReset');
  });
});
