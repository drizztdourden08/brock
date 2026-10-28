/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defineHub } from '../src/hub/define-hub';
import { visibleHubPages } from '../src/hub/Hub/behavior/visible-hub-pages';
import type { HubDef, HubPage } from '../src/hub/hub.type';
import { nav } from '../src/navigation/nav';
import { restoreNavigation } from '../src/navigation/restore-navigation';
import { readSavedNavigation } from '../src/navigation/read-saved-navigation';
import { stickyParams } from '../src/navigation/sticky-params';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { PlatformProvider } from '../src/platform/PlatformProvider';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { currentShowContext } from '../src/screens/show/current-show-context';
import type { ShowContext } from '../src/screens/show/show.type';
import { useShowContext } from '../src/screens/show/useShowContext';
import { showHarness } from './show-harness';

const state = () => useNavigationStore.getState();
const page = (id: string, extra: Partial<HubPage> = {}): HubPage => ({ id, label: id, icon: null, render: () => null, ...extra });

const seen: ShowContext[] = [];
const Probe = () => {
  seen.push(useShowContext());
  return null;
};

beforeEach(() => {
  stickyParams.set('props', ['subject', 'pin']);
});

afterEach(() => {
  stickyParams.set('props', undefined);
  seen.length = 0;
  showHarness.resetShow();
});

describe('sticky hub params', () => {
  it('keep their value when the page changes inside the hub, and Back brings the earlier page with them', () => {
    nav.open('props', { subject: 'a.png', pin: true });
    nav.open('props/summary');
    expect(state().params).toEqual({ subject: 'a.png', pin: true, section: 'summary', tab: undefined });
    nav.open('props/colors');
    expect(state().params).toMatchObject({ subject: 'a.png', pin: true, section: 'colors' });
    expect(nav.back()).toBe(true);
    expect(state().params).toMatchObject({ subject: 'a.png', pin: true, section: 'summary' });
  });

  it('survive a save and a restore, and go on sticking after it', () => {
    nav.open('props', { subject: 'a.png' });
    nav.open('props/summary');
    const { active, params, history, remembered, closed } = state();
    const saved = readSavedNavigation(JSON.parse(JSON.stringify({ active, params, history, remembered, closed })), () => true);
    state().restore(null);
    restoreNavigation(saved, 'home');
    expect(state().params).toMatchObject({ subject: 'a.png', section: 'summary' });
    nav.open('props/colors');
    expect(state().params).toMatchObject({ subject: 'a.png', section: 'colors' });
    expect(nav.back()).toBe(true);
    expect(state().params).toMatchObject({ subject: 'a.png', section: 'summary' });
  });

});

describe('sticky hub params across screens and links', () => {
  it('stay when a sub-page goes up, and when the hub is left and opened again on a page', () => {
    nav.open('props', { subject: 'a.png' });
    nav.open('props/summary/more');
    nav.up({ section: 'summary' });
    expect(state().params).toMatchObject({ subject: 'a.png', section: 'summary' });
    expect(state().params.tab).toBeUndefined();
    nav.open('other');
    nav.open('props/colors');
    expect(state().params).toMatchObject({ subject: 'a.png', section: 'colors' });
  });

  it('change when a link names a new value, clear when it names undefined, and reset on Home', () => {
    nav.open('props', { subject: 'a.png', pin: true });
    nav.open('props/summary', { subject: 'b.png' });
    expect(state().params).toMatchObject({ subject: 'b.png', pin: true });
    nav.open('props/colors', { pin: undefined });
    expect(state().params.pin).toBeUndefined();
    expect(state().params.subject).toBe('b.png');
    nav.home('props');
    expect(state().params.subject).toBeUndefined();
  });

  it('leave other screens alone', () => {
    nav.open('props', { subject: 'a.png' });
    nav.open('plain', { subject: 'x' });
    nav.open('plain/page');
    expect(state().params.subject).toBeUndefined();
  });

  it('are registered by a hub from its params, and a bucket hands them to its hub', () => {
    defineHub({ id: 'studio', title: 'Studio', icon: null, home: page('home'), groups: [], params: ['subject'] });
    expect(stickyParams.keys('studio')).toEqual(['subject']);
    stickyParams.set('studio', undefined);
    const View = () => null;
    const tree = buildScreenTree(
      { buckets: [{ id: 'one', title: 'One', icon: 'house', menu: 'entry', params: ['subject'], header: { render: () => null } }], home: 'one' },
      [{ kind: 'page', bucket: 'one', id: 'a', component: View }],
    );
    expect(tree.hubs[0]?.params).toEqual(['subject']);
    expect(tree.hubs[0]?.header).toBeDefined();
  });
});

describe('sticky params in a show rule', () => {
  const HUB: HubDef = {
    id: 'props',
    title: 'Properties',
    icon: null,
    home: page('home'),
    groups: [{ id: 'main', label: 'Main', pages: [page('summary', { show: { when: ({ params }) => params.subject !== undefined } })] }],
  };
  const idsFor = (ctx: ShowContext): string[] => visibleHubPages(HUB, false, ctx).pages.map((candidate) => candidate.id);

  it('read the open hub params through ctx.params', () => {
    const draw = () => showHarness.render(createElement(PlatformProvider, null, createElement(Probe)));
    draw();
    expect(seen.at(-1)?.params).toEqual({});
    expect(idsFor(seen.at(-1) as ShowContext)).toEqual(['home']);
    act(() => nav.open('props', { subject: 'a.png' }));
    expect(seen.at(-1)?.params).toEqual({ subject: 'a.png' });
    expect(idsFor(seen.at(-1) as ShowContext)).toEqual(['home', 'summary']);
    expect(currentShowContext().params).toEqual({ subject: 'a.png' });
  });

  it('keep one object while the sticky values hold, so memos on the context do not run again', () => {
    showHarness.render(createElement(PlatformProvider, null, createElement(Probe)));
    act(() => nav.open('props', { subject: 'a.png' }));
    const first = seen.at(-1);
    act(() => nav.open('props/summary'));
    act(() => nav.open('props/colors'));
    expect(seen.at(-1)?.params).toBe(first?.params);
    expect(seen.at(-1)).toBe(first);
    act(() => nav.open('props/colors', { subject: 'b.png' }));
    expect(seen.at(-1)?.params).toEqual({ subject: 'b.png' });
    expect(seen.at(-1)).not.toBe(first);
  });
});
