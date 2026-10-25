/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
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

const drawOnPlatform = (element: ReactElement, windowChrome = true): string =>
  renderToStaticMarkup(createElement(PlatformContext.Provider, { value: platformWith(windowChrome) }, element));

const Bar = () => createElement(AppTitleBar, { title: 'Demo', menu: [], controls: useBarControls(CONTROLS), instanceName: null, hidden: false });

export { Bar, CONTROLS, drawOnPlatform };
