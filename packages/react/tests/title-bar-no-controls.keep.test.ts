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

const CONTROLS: TitleBarControls = { fullscreen: true, pin: true, minimize: true, maximize: true };

const platformWith = (windowChrome: boolean): Platform => {
  const web = createPlatform(createWebFactory());
  return { ...web, capabilities: { ...web.capabilities, titleBar: true, windowChrome } };
};

const Bar = () => createElement(AppTitleBar, { title: 'Demo', menu: [], controls: useBarControls(CONTROLS), instanceName: null, hidden: false });

const draw = (windowChrome: boolean): string => renderToStaticMarkup(createElement(PlatformContext.Provider, { value: platformWith(windowChrome) }, createElement(Bar)));

describe('the title bar on a host without window buttons', () => {
  it('draws the bar with no window control at all, close included', () => {
    const html = draw(false);
    expect(html).toContain('Demo');
    expect(html).not.toContain('window-title-bar__control');
    expect(html).not.toContain('window-title-bar__controls');
  });

  it('keeps the window controls, close included, where the host has window chrome', () => {
    const html = draw(true);
    expect(html).toContain('window-title-bar__control--close');
    expect(html).toContain('window-title-bar__controls');
  });
});
