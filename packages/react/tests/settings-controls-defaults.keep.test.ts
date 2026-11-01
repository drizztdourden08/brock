/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { SettingsControlsValue } from '../src/app/brock-context.type';
import { useSettingsControls } from '../src/app/BrockApp/behavior/useSettingsControls';
import type { BrockAppSettings } from '../src/app/BrockApp/BrockApp.type';
import { settingRow } from '../src/settings/SettingsLayout/behavior/setting-row';
import type { SettingItem } from '../src/settings/settings.type';

interface Shape {
  theme: string;
}

const DEFAULTS: Shape = { theme: 'dark' };

const CHOICE: SettingItem = {
  key: 'theme',
  label: 'Theme',
  description: 'The colour theme.',
  control: { kind: 'choice', options: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }] },
};

const controlsOf = (settings: BrockAppSettings<Shape>): SettingsControlsValue => {
  const captured: { value?: SettingsControlsValue } = {};
  const Probe = () => {
    captured.value = useSettingsControls(settings);
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  if (captured.value === undefined) throw new Error('The probe did not render.');
  return captured.value;
};

describe('K5 settings controls defaults', { tags: ['critical'] }, () => {
  it('hands the app defaults to the tab pages through the controls value', () => {
    expect(controlsOf({ defaults: DEFAULTS }).defaults).toBe(DEFAULTS);
  });

  it('lets a standard choice row show the changed dot once the value leaves the defaults', () => {
    const { defaults } = controlsOf({ defaults: DEFAULTS });
    const context = (settings: Shape) => ({ settings, defaults, onChange: () => undefined, disabled: false, lock: null });
    expect(settingRow(CHOICE, context({ theme: 'dark' }))).toMatchObject({ changed: false });
    expect(settingRow(CHOICE, context({ theme: 'light' }))).toMatchObject({ changed: true });
  });
});
