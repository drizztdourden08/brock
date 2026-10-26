/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SettingsLayout } from '../src/settings/SettingsLayout/SettingsLayout';
import { SettingsPreviewLayout } from '../src/settings/SettingsLayout/sub-components/SettingsPreviewLayout';
import { HubTabContent } from '../src/settings/SettingsHub/sub-components/HubTabContent';
import type { Section, TabDef } from '../src/settings/settings.type';

const SECTIONS: Section[] = [{ id: 'look', title: 'Look', items: [{ key: 'accent', label: 'Accent', noDescription: true, control: { kind: 'text' } }] }];

const CSS = readFileSync(new URL('../src/settings/SettingsLayout/sub-components/SettingsPreviewLayout/SettingsPreviewLayout.css', import.meta.url), 'utf8');

const layout = (extra: object = {}) => renderToStaticMarkup(createElement(SettingsLayout, { sections: SECTIONS, settings: { accent: 'red' }, onChange: () => undefined, ...extra }));

describe('settings preview column', () => {
  it('draws the preview and the rows in two named cells of one container', () => {
    const html = layout({ preview: createElement('canvas', { id: 'sample' }) });
    expect(html).toContain('settings-preview-layout__grid settings-preview-layout__grid--end');
    expect(html.indexOf('settings-preview-layout__preview')).toBeLessThan(html.indexOf('settings-preview-layout__rows'));
    expect(html.indexOf('id="sample"')).toBeLessThan(html.indexOf('Accent'));
  });

  it('puts the preview first beside the rows on request', () => {
    expect(layout({ preview: 'p', previewPlacement: 'start' })).toContain('settings-preview-layout__grid--start');
  });

  it('adds no wrapper when a page has no preview', () => {
    expect(layout()).not.toContain('settings-preview-layout');
    expect(renderToStaticMarkup(createElement(SettingsPreviewLayout, null, 'rows'))).toBe('rows');
  });

  it('stacks by default and goes two columns only inside a wide container', () => {
    const base = CSS.slice(0, CSS.indexOf('@container'));
    const wide = CSS.slice(CSS.indexOf('@container'));
    expect(base).toContain('container: settings-preview / inline-size');
    expect(base).toContain('grid-template-columns: minmax(0, 1fr);');
    expect(base).toMatch(/grid-template-areas:\s*'preview'\s*'rows'/);
    expect(wide).toMatch(/@container settings-preview \(width >= /);
    expect(wide).toContain("grid-template-areas: 'rows preview'");
    expect(wide).toContain("grid-template-areas: 'preview rows'");
  });

  it('reads the tab preview with the live settings', () => {
    const tab: TabDef<{ accent: string }> = {
      id: 'look', label: 'Look', navIcon: null, group: 'App', sections: () => SECTIONS,
      preview: (settings) => createElement('b', null, `swatch ${settings.accent}`), previewPlacement: 'start',
    };
    const html = renderToStaticMarkup(createElement(HubTabContent<{ accent: string }>, { tab, settings: { accent: 'teal' }, onChange: () => undefined }));
    expect(html).toContain('swatch teal');
    expect(html).toContain('settings-preview-layout__grid--start');
  });
});
