/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HubTabContent } from '../src/settings/SettingsHub/sub-components/HubTabContent';
import type { Section, TabDef } from '../src/settings/settings.type';

const SECTIONS: Section[] = [{ id: 'look', title: 'Look', items: [{ key: 'accent', label: 'Accent', noDescription: true, control: { kind: 'text' } }] }];

describe('S1 settings preview column', { tags: ['standard'] }, () => {
  it('reads the tab preview with the live settings', () => {
    const tab: TabDef<{ accent: string }> = {
      id: 'look', label: 'Look', navIcon: null, group: 'App', sections: () => SECTIONS,
      preview: (settings) => createElement('b', null, `swatch ${settings.accent}`), previewPlacement: 'start',
    };
    const html = renderToStaticMarkup(createElement(HubTabContent<{ accent: string }>, { tab, settings: { accent: 'teal' }, onChange: () => undefined }));
    expect(html).toContain('swatch teal');
  });
});
