/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Hub } from '../src/hub/Hub';
import { showsHubNav } from '../src/hub/Hub/behavior/shows-hub-nav';
import type { HubDef, HubPage } from '../src/hub/hub.type';
import { NO_PARAMS } from '../src/navigation/navigation.constants';
import type { ScreenParams } from '../src/navigation/navigation.type';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { bucketChecks } from '../src/review/checks/bucket-checks';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { HubNavMode } from '../src/screens/conventions/screens-config.type';
import type { ShowContext } from '../src/screens/show/show.type';
import { useShowFlags } from '../src/screens/show/useShowFlags';
import { showHarness } from './show-harness';

const page = (id: string, extra: Partial<HubPage> = {}): HubPage => ({ id, label: id, icon: null, fullBleed: true, render: () => createElement('p', null, `page ${id}`), ...extra });

const HOME = page('home');
const BILLING = page('billing', { show: { when: ({ flags }: ShowContext) => flags.signedIn === true } });
const hubWith = (nav?: HubNavMode, pages: HubPage[] = [BILLING]): HubDef => ({
  id: 'account', title: 'Account', icon: null, home: HOME, groups: [{ id: 'account', label: 'Account', pages }], search: { placeholder: 'Search' }, nav,
});

const Flags = (props: { signedIn: boolean }) => {
  useShowFlags({ signedIn: props.signedIn });
  return null;
};

const draw = (def: HubDef, signedIn: boolean, params: ScreenParams = NO_PARAMS): void => {
  const ctx = { params, profile: null, close: () => undefined, open: () => undefined };
  showHarness.render(createElement(PlatformProvider, null, createElement(Flags, { signedIn }), createElement(Hub, { def, ctx })));
};

const navItems = (): string[] => [...document.querySelectorAll('.side-nav__item')].map((item) => item.getAttribute('aria-label') ?? '');

afterEach(showHarness.resetShow);

describe('the hub nav with one visible page', () => {
  it('shows only when it is useful, unless the hub asks for it always or never', () => {
    expect(showsHubNav(undefined, 1)).toBe(false);
    expect(showsHubNav('auto', 1)).toBe(false);
    expect(showsHubNav('auto', 2)).toBe(true);
    expect(showsHubNav('always', 1)).toBe(true);
    expect(showsHubNav(false, 3)).toBe(false);
  });

  it('draws the one page alone, then the nav and its search once a flag shows a second page', () => {
    draw(hubWith(), false);
    expect(document.querySelector('.side-nav-layout')).toBeNull();
    expect(document.querySelector('.side-nav__search-input')).toBeNull();
    expect(document.querySelector('.hub__solo')?.textContent).toBe('page home');
    draw(hubWith(), true);
    expect(document.querySelector('.hub__solo')).toBeNull();
    expect(navItems()).toEqual(['home', 'billing']);
    expect(document.querySelector('.side-nav__search-input, .side-nav__search')).not.toBeNull();
    draw(hubWith(), false);
    expect(document.querySelector('.side-nav-layout')).toBeNull();
  });

  it('keeps the nav with nav: always, and leaves it out with nav: false while Escape still goes up to the hub home', () => {
    draw(hubWith('always'), false);
    expect(navItems()).toEqual(['home']);
    showHarness.unmount();
    draw(hubWith(false), true, { section: 'billing' });
    expect(document.querySelector('.side-nav-layout')).toBeNull();
    expect(document.querySelector('.hub__solo')?.textContent).toBe('page billing');
    expect(useNavigationStore.getState().escapeTo).toEqual(NO_PARAMS);
  });

  it('takes nav from the bucket of screens.config.ts', () => {
    const View = () => null;
    const tree = buildScreenTree(
      { buckets: [{ id: 'one', title: 'One', icon: 'house', menu: 'entry', nav: 'always' }, { id: 'two', title: 'Two', icon: 'house', menu: 'entry' }], home: 'one' },
      [{ kind: 'page', bucket: 'one', id: 'a', component: View }, { kind: 'page', bucket: 'two', id: 'b', component: View }],
    );
    expect(tree.hubs.map((hub) => hub.nav)).toEqual(['always', undefined]);
  });
});

describe('the review of a hub with no nav', () => {
  it('passes a one-page hub with no nav drawn, and fails one that draws a nav it should leave out', () => {
    const pass = bucketChecks({ hub: 'account', reachedVia: 'the menu entry Account', nav: false, expected: ['home'], shown: [] });
    expect(pass.map((check) => check.pass)).toEqual([true, true]);
    const fail = bucketChecks({ hub: 'account', reachedVia: 'the menu entry Account', nav: false, expected: ['home'], shown: ['home'] });
    expect(fail[1]?.pass).toBe(false);
    const listed = bucketChecks({ hub: 'account', reachedVia: 'the menu entry Account', nav: true, expected: ['home', 'billing'], shown: ['home'] });
    expect(listed[1]?.reason).toContain('billing');
  });
});
