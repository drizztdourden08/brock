/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { Fragment, createElement } from 'react';
import type { ComponentType } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { defineProduct } from '@drizztdourden08/brock-core';
import { BrockContext } from '../src/app/brock-context';
import type { BrockContextValue } from '../src/app/brock-context.type';
import type { HubDef, HubRenderContext } from '../src/hub/hub.type';
import { heroChecks } from '../src/review/checks/hero-checks';
import { readHero } from '../src/review/dom/read-hero';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { heroArtNone } from '../src/screens/kinds/hero-art-none';
import { heroArtOf } from '../src/screens/kinds/hero-art-of';
import type { HeroProps } from '../src/screens/kinds/screen-kinds.type';
import { showHarness } from './show-harness';

const noop = (): void => undefined;

const BROCK: BrockContextValue = {
  product: defineProduct({
    id: 'demo', name: 'Demo', appId: 'com.example.demo', ports: { base: 35800 }, description: 'A test app.', author: { name: 'tester', email: 'tester@example.com' }, icons: { brand: 'brock' },
  }),
  home: 'library', tabs: [], settingsControls: {}, menu: [], homeScreen: 'library', shortcuts: [], screenTree: null, logoSrc: '', instanceLogoSrc: '', moduleIds: [],
};

const NoArt = (props: HeroProps) => {
  const { Title, Art } = props.slots;
  return createElement(Fragment, null, createElement(Title, null, 'Library'), createElement(Art, { kind: 'none' }));
};

const BrandArt = (props: HeroProps) => createElement(props.slots.Title, null, 'Library');

const heroHub = (component: ComponentType<HeroProps>): HubDef => {
  const tree = buildScreenTree(
    { buckets: [{ id: 'library', title: 'Library', icon: 'house', menu: 'entry' }], home: 'library' },
    [{ kind: 'hero', bucket: 'library', id: 'home', component }],
  );
  const [hub] = tree.hubs;
  if (hub === undefined) throw new Error('no hub');
  return hub;
};

const drawHome = (hub: HubDef): Element | null => {
  const context: HubRenderContext = { hub, page: hub.home, tab: null, sub: null, subParams: {}, params: {}, open: noop, close: noop, profile: null };
  return showHarness.render(createElement(BrockContext.Provider, { value: BROCK }, hub.home.render(context))).querySelector('.hero');
};

afterEach(showHarness.resetShow);

describe('hero art none', () => {
  it('turns kind none into no art', () => {
    expect(heroArtOf({ kind: 'none' })).toBeNull();
    expect(heroArtOf({ kind: 'image', src: 'a.png' })).toEqual({ kind: 'image', src: 'a.png', alt: undefined, pixelated: undefined });
  });

  it('draws the brand art in a hero that renders no Art', () => {
    const hero = drawHome(heroHub(BrandArt));
    expect(hero?.querySelector('.hero__art')).not.toBeNull();
    expect(heroArtNone.has('library')).toBe(false);
  });

  it('draws no art, not even the brand art, in a hero with Art kind none, and the review check passes', () => {
    const hero = drawHome(heroHub(NoArt));
    expect(hero).not.toBeNull();
    expect(hero?.querySelector('.hero__art')).toBeNull();
    expect(heroArtNone.has('library')).toBe(true);
    const outcome = heroChecks(readHero('library', hero, heroArtNone.has('library'))).find((o) => o.id === 'library-hero-art-none');
    expect(outcome?.pass).toBe(true);
  });

  it('forgets the hero when it unmounts', () => {
    drawHome(heroHub(NoArt));
    showHarness.unmount();
    expect(heroArtNone.has('library')).toBe(false);
  });
});
