/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { BootFailure, Platform } from '@drizztdourden08/brock-core';
import { createPlatform, defineProduct } from '@drizztdourden08/brock-core';
import { BrockContext } from '../src/app/brock-context';
import type { BrockContextValue } from '../src/app/brock-context.type';
import { BootFailureSplash } from '../src/boot/BootFailureSplash';
import { PlatformContext } from '../src/platform/platform-context';
import { createWebFactory } from '../src/platform/hosts/web-factory';

const BROCK: BrockContextValue = {
  product: defineProduct({ id: 'demo', name: 'Demo', appId: 'com.example.demo', ports: { base: 35800 }, description: 'A test app.', author: { name: 'tester', email: 'tester@example.com' } }),
  home: 'home', tabs: [], settingsControls: {}, menu: [], homeScreen: 'home', shortcuts: [], screenTree: null, logoSrc: '', instanceLogoSrc: '', moduleIds: [],
};

const platformWith = (desktop: boolean): Platform => {
  const web = createPlatform(createWebFactory());
  if (!desktop) return web;
  return { ...web, capabilities: { ...web.capabilities, windowChrome: true }, storage: { ...web.storage, revealLogs: vi.fn(() => Promise.resolve()) } };
};

const draw = (platform: Platform, failure: BootFailure): string => renderToStaticMarkup(
  createElement(PlatformContext.Provider, { value: platform }, createElement(BrockContext.Provider, { value: BROCK }, createElement(BootFailureSplash, { failure }))),
);

const FAILURE: BootFailure = { task: 'settings', label: 'Settings', message: 'config.json is not valid JSON', timedOut: false };

describe('BootFailureSplash', () => {
  it('draws the failed splash with the task, the error, Retry, Open logs and Quit, as the splash page does', () => {
    const html = draw(platformWith(true), { task: 'settings', label: 'Settings', message: 'config.json is not valid JSON', timedOut: false });
    for (const part of ['ts-splash ts-splash--layer', 'ts-mark', 'ts-status ts-status--danger', 'ts-detail', 'ts-progress--danger', 'ts-version']) expect(html).toContain(part);
    expect(html).toContain('Demo');
    expect(html).toContain('Settings failed');
    expect(html).toContain('config.json is not valid JSON');
    expect(html).toContain('data-boot-failure="settings"');
    for (const label of ['Retry', 'Open logs', 'Quit']) expect(html).toContain(`>${label}<`);
  });

  it('paints the dark ground wordmark over the title and keeps the name as its text', () => {
    const product = defineProduct({ id: 'demo', name: 'Demo', appId: 'com.example.demo', author: { name: 'tester' }, icons: { wordmark: { src: './logos/w.svg', dark: './logos/w-dark.svg' } } });
    const html = renderToStaticMarkup(
      createElement(PlatformContext.Provider, { value: platformWith(true) }, createElement(BrockContext.Provider, { value: { ...BROCK, product } }, createElement(BootFailureSplash, { failure: FAILURE }))),
    );
    expect(html).toContain('class="ts-splash ts-splash--layer boot-failure-splash boot-failure-splash--wordmark"');
    expect(html).toContain('--boot-wordmark:url(&quot;./logos/w-dark.svg&quot;)');
    expect(html).toMatch(/<h1 class="ts-title">Demo<\/h1>/);
  });

  it('adds no wordmark class or style without one', () => {
    const html = draw(platformWith(true), FAILURE);
    expect(html).toContain('class="ts-splash ts-splash--layer boot-failure-splash"');
    expect(html).not.toContain('--boot-wordmark');
  });

  it('keeps only Retry where the host cannot open the logs folder or close the window', () => {
    const html = draw(platformWith(false), { task: 'fonts', label: 'Fonts', message: 'timed out', timedOut: true });
    expect(html).toContain('Fonts took too long');
    expect(html).toContain('>Retry<');
    expect(html).not.toContain('Open logs');
    expect(html).not.toContain('Quit');
  });
});
