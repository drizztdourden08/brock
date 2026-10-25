/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { Platform, TitleBarControls } from '@drizztdourden08/brock-core';
import { createPlatform } from '@drizztdourden08/brock-core';
import { useBarControls } from '../src/app/BrockApp/behavior/useBarControls';
import { AppTitleBar } from '../src/app/BrockApp/sub-components/AppTitleBar';
import { PlatformContext } from '../src/platform/platform-context';
import { createWebFactory } from '../src/platform/hosts/web-factory';
import { focusRegion } from '../src/regions/focus-region';
import { SHELL_LABELS } from '../src/regions/regions.constants';

const CONTROLS: TitleBarControls = { fullscreen: true, pin: true, minimize: true, maximize: true };

const platform = (): Platform => {
  const web = createPlatform(createWebFactory());
  return { ...web, capabilities: { ...web.capabilities, titleBar: true, windowChrome: true } };
};

const Bar = () => createElement(AppTitleBar, { title: 'Demo', menu: [], controls: useBarControls(CONTROLS), instanceName: null, hidden: false });

describe('the shell landmarks', () => {
  it('wraps the title bar in one labelled banner', () => {
    const html = renderToStaticMarkup(createElement(PlatformContext.Provider, { value: platform() }, createElement(Bar)));
    expect(html.match(/role="banner"/g)).toHaveLength(1);
    expect(html).toContain(`aria-label="${SHELL_LABELS.titleBar}"`);
    expect(html.indexOf('role="banner"')).toBeLessThan(html.indexOf('window-title-bar'));
  });

  it('names the screen rail with the shell label', () => {
    expect(SHELL_LABELS.screens).toBe('Screens');
  });

  it('marks an app region as a labelled region with its id', () => {
    expect(focusRegion('canvas', 'Sprite canvas')).toEqual({ 'data-focus-region': 'canvas', role: 'region', 'aria-label': 'Sprite canvas' });
  });
});
