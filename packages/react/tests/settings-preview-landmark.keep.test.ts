/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { regionTargets } from '../src/regions/region-targets';
import { SettingsPreviewLayout } from '../src/settings/SettingsLayout/sub-components/SettingsPreviewLayout';

const page = (props: object = {}) => {
  const rows = createElement('button', { id: 'row' }, 'y');
  const layout = createElement(SettingsPreviewLayout, { preview: createElement('button', { id: 'swatch' }, 'x'), children: rows, ...props });
  document.body.innerHTML = renderToStaticMarkup(createElement('main', { 'aria-label': 'Main' }, layout));
  return regionTargets().map((region) => region.getAttribute('aria-label'));
};

describe('S1 settings preview landmark in region cycling', { tags: ['standard'] }, () => {
  it('gives F6 a stop on the preview and one on the rows, inside the main area', () => {
    expect(page()).toEqual(['Preview', 'Settings']);
  });

  it('leaves the main area as the only stop when there is no preview', () => {
    expect(page({ preview: undefined })).toEqual(['Main']);
  });
});
