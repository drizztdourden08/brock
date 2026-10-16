/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { Fragment, createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import type { HubDef, HubRenderContext } from '../src/hub/hub.type';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { HeroMeta } from '../src/screens/conventions/screens-config.type';
import type { HeroProps } from '../src/screens/kinds/screen-kinds.type';
import { showHarness } from './show-harness';

const noop = (): void => undefined;

const Home = (props: HeroProps) => {
  const { Title } = props.slots;
  return createElement(Title, null, 'Library');
};

const heroHub = (hero?: HeroMeta): HubDef => {
  const tree = buildScreenTree(
    { buckets: [{ id: 'library', title: 'Library', icon: 'house', menu: 'entry' }], home: 'library' },
    [{ kind: 'hero', bucket: 'library', id: 'home', component: Home, meta: hero ? { hero } : undefined }],
  );
  const [hub] = tree.hubs;
  if (hub === undefined) throw new Error('no hub');
  return hub;
};

const drawHome = (hub: HubDef): HTMLElement => {
  const context: HubRenderContext = { hub, page: hub.home, tab: null, sub: null, subParams: {}, params: {}, open: noop, close: noop, profile: null };
  return showHarness.render(createElement(Fragment, null, hub.home.render(context)));
};

afterEach(showHarness.resetShow);

describe('meta.hero.size', () => {
  it('passes compact and tall to the Tessera Hero', () => {
    expect(drawHome(heroHub({ size: 'compact' })).querySelector('.hero')?.classList.contains('hero--compact')).toBe(true);
    expect(drawHome(heroHub({ size: 'tall' })).querySelector('.hero')?.classList.contains('hero--tall')).toBe(true);
  });

  it('keeps the default hero without a size', () => {
    const hero = drawHome(heroHub()).querySelector('.hero');
    expect(hero).not.toBeNull();
    expect(hero?.className).not.toMatch(/hero--(?:compact|tall)/);
  });
});
