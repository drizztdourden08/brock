/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { HubSwitch } from '../src/hub/Hub/sub-components/HubSwitch';
import { switcherHubs } from '../src/hub/Hub/behavior/switcher-hubs';
import { nav } from '../src/navigation/nav';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import type { BucketDef } from '../src/screens/conventions/screens-config.type';
import { createScreenRegistry } from '../src/screens/create-screen-registry';
import { ScreenRegistryContext } from '../src/screens/screen-registry-context';
import { showHarness } from './show-harness';

const View = () => null;

const GAME: BucketDef = { id: 'game', title: 'Game', icon: 'house', menu: 'entry' };
const CONTROLLERS: BucketDef = { id: 'controllers', title: 'Controllers', icon: 'folder', menu: 'hidden', switcher: false };
const DATA: BucketDef = { id: 'data', title: 'Data', icon: 'database', menu: 'entry' };

const resolved = (buckets: BucketDef[]) => resolveScreenTree(
  buildScreenTree({ buckets, home: 'game' }, buckets.map((bucket) => ({ kind: 'page', bucket: bucket.id, id: 'pad', component: View }))),
  [],
);

const draw = (buckets: BucketDef[], current: string): void => {
  const registry = createScreenRegistry(resolved(buckets).screens);
  showHarness.render(createElement(
    PlatformProvider,
    null,
    createElement(ScreenRegistryContext.Provider, { value: registry }, createElement(HubSwitch, { current, onSelect: () => undefined })),
  ));
};

const tabs = (): string[] => [...document.querySelectorAll('.floating-switch__label')].map((label) => label.textContent);

const selected = (): string[] => [...document.querySelectorAll('.floating-switch__item--active .floating-switch__label')].map((label) => label.textContent);

afterEach(showHarness.resetShow);

describe('a bucket kept out of the hub switcher', () => {
  it('carries switcher: false from the bucket to its hub, and shows by default', () => {
    const hubs = resolved([GAME, CONTROLLERS, DATA]).hubs;
    expect(hubs.map((hub) => hub.switcher)).toEqual([undefined, false, undefined]);
    expect(switcherHubs(hubs).map((hub) => hub.id)).toEqual(['game', 'data']);
  });

  it('draws no tab for it, and keeps the other tabs', () => {
    draw([GAME, CONTROLLERS, DATA], 'game');
    expect(tabs()).toEqual(['Game', 'Data']);
    expect(selected()).toEqual(['Game']);
  });

  it('selects no tab while the hidden bucket is the open one', () => {
    draw([GAME, CONTROLLERS, DATA], 'controllers');
    expect(tabs()).toEqual(['Game', 'Data']);
    expect(selected()).toEqual([]);
  });

  it('draws no switch when one visible bucket is left, as it does for a single bucket', () => {
    draw([GAME, CONTROLLERS], 'controllers');
    expect(document.querySelector('.floating-switch')).toBeNull();
  });

  it('still registers the screen and opens it by route', () => {
    expect(resolved([GAME, CONTROLLERS, DATA]).screens.map((screen) => screen.id)).toContain('controllers');
    nav.open('controllers/pad');
    const { active, params } = useNavigationStore.getState();
    expect([active, params.section]).toEqual(['controllers', 'pad']);
  });
});
