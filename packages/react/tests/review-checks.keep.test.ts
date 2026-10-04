/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { MenuEntry } from '../src/menu/menu.type';
import { aboutChecks } from '../src/review/checks/about-checks';
import { bootChecks } from '../src/review/checks/boot-checks';
import { frameChecks } from '../src/review/checks/frame-checks';
import { pageHeaderChecks } from '../src/review/checks/page-header-checks';
import { screenFocusChecks } from '../src/review/checks/screen-focus-checks';
import { iconSlotChecks } from '../src/review/checks/icon-slot-checks';
import { menuChecks } from '../src/review/checks/menu-checks';
import { menuExpectation } from '../src/review/menu/menu-expectation';
import { menuPathTo } from '../src/review/menu/menu-path-to';
import { updaterChecks } from '../src/review/checks/updater-checks';
import { viewMenuChecks } from '../src/review/checks/view-menu-checks';
import type { BootSnapshot, MenuItemSnapshot, ReviewOutcome } from '../src/review/review.type';

const failed = (outcomes: readonly ReviewOutcome[]): string[] => outcomes.filter((o) => !o.pass).map((o) => o.id);
const reasonOf = (outcomes: readonly ReviewOutcome[], id: string): string | undefined => outcomes.find((o) => o.id === id)?.reason;
const item = (label: string, hasIcon = true, isSection = false): MenuItemSnapshot => ({ label, hasIcon, isSection });

const BOOT: BootSnapshot = {
  titleBarVisible: true,
  title: 'Demo',
  expectedTitle: 'Demo',
  logoLoaded: true,
  searchButton: true,
  bugReportButton: true,
  barItems: ['control:pin', 'action:search', 'action:report-bug', 'control:fullscreen'],
  expectedBarItems: ['action:search', 'action:report-bug'],
};

const MENU: MenuEntry[] = [
  { key: 'home', label: 'Home', screen: 'settings' },
  { key: 'profiles', label: 'Profiles', screen: 'profiles' },
  'separator',
  { key: 'section:advanced', label: 'Advanced', children: [{ key: 'tools', label: 'Tools', screen: 'tools' }] },
  { key: 'about', label: 'About', screen: 'about' },
  { key: 'quit', label: 'Quit' },
];

describe('bootChecks', () => {
  it('passes a complete title bar', () => {
    expect(failed(bootChecks(BOOT))).toEqual([]);
  });

  it('names what is wrong', () => {
    const outcomes = bootChecks({ ...BOOT, title: 'Other', logoLoaded: false, bugReportButton: false, barItems: ['action:search'] });
    expect(failed(outcomes)).toEqual(['title-text', 'title-bar-logo', 'bug-report-button', 'title-bar-actions']);
    expect(reasonOf(outcomes, 'title-bar-actions')).toBe('no bar item for the title bar action action:report-bug');
  });

  it('expects only the actions the bar draws', () => {
    expect(failed(bootChecks({ ...BOOT, expectedBarItems: [] }))).toEqual([]);
  });
});

describe('menuExpectation', () => {
  it('drops Settings when it is the home screen and takes labels from the built menu', () => {
    expect(menuExpectation(MENU, 'settings')).toEqual({ required: ['Home', 'Profiles', 'About', 'Quit'], sections: ['Advanced'], actions: [], view: null });
  });

  it('expects the sections the menu holds, every title bar action and the View sub-menu', () => {
    const actions = [
      { id: 'search', label: 'Search', icon: 'search', onSelect: () => undefined },
      { id: 'updater:check', label: 'Check for updates', icon: 'refresh-cw', bar: 'status', onSelect: () => undefined },
    ] as const;
    const plain = MENU.filter((entry) => entry === 'separator' || !entry.children);
    expect(menuExpectation(plain, 'settings', { actions, controls: { pin: true, fullscreen: false } })).toMatchObject({
      sections: [], actions: ['Search', 'Check for updates'], view: 'View',
    });
    expect(menuExpectation(plain, 'settings', { controls: { pin: false, fullscreen: false } }).view).toBeNull();
  });

  it('asks for Settings when home is elsewhere', () => {
    const hubMenu: MenuEntry[] = [{ key: 'home', label: 'Home', screen: 'hub' }, ...MENU.slice(1)];
    expect(menuExpectation(hubMenu, 'hub').required).toEqual(['Home', 'Profiles', 'Settings', 'About', 'Quit']);
  });
});

describe('menuChecks', () => {
  const expected = { required: ['Home', 'Quit'], sections: ['Advanced'], actions: ['Report a bug'], view: 'View' };

  it('passes a full menu', () => {
    const items = [item('Home'), item('Advanced', true, true), item('Quit'), item('View', true, true), item('Report a bug')];
    expect(failed(menuChecks({ open: true, items }, expected))).toEqual([]);
  });

  it('counts a title bar dropdown listed as a sub-menu', () => {
    const items = [item('Home'), item('Advanced', true, true), item('Quit'), item('View', true, true), item('Report a bug'), item('Rooms', true, true)];
    expect(failed(menuChecks({ open: true, items }, { ...expected, actions: ['Report a bug', 'Rooms'] }))).toEqual([]);
  });

  it('reports a closed menu once', () => {
    expect(menuChecks({ open: false, items: [] }, expected)).toEqual([{ id: 'menu-opens', pass: false, reason: 'the menu did not open' }]);
  });

  it('catches missing entries, sections and icons', () => {
    const outcomes = menuChecks({ open: true, items: [item('Home', false)] }, expected);
    expect(failed(outcomes)).toEqual(['menu-entries', 'menu-sections', 'menu-actions', 'menu-view', 'menu-icons']);
    expect(reasonOf(outcomes, 'menu-icons')).toBe('no icon on Home');
  });
});

describe('menuPathTo', () => {
  it('finds a top entry, then a nested one', () => {
    expect(menuPathTo(MENU, (entry) => entry.screen === 'about')).toEqual(['About']);
    expect(menuPathTo(MENU, (entry) => entry.screen === 'tools')).toEqual(['Advanced', 'Tools']);
    expect(menuPathTo(MENU, (entry) => entry.screen === 'missing')).toBeNull();
  });
});

describe('frameChecks', () => {
  it('passes the standard frame and fails a bare screen', () => {
    expect(failed(frameChecks('about', 'About', { layers: 1, card: true, title: 'About', closeButton: true }))).toEqual([]);
    expect(failed(frameChecks('about', 'About', { layers: 0, card: false, title: null, closeButton: false })))
      .toEqual(['about-opens', 'about-frame', 'about-header', 'about-close-control']);
  });
});

describe('screenFocusChecks', () => {
  it('passes a screen that takes focus and makes the page inert while the title bar and dock stay usable', () => {
    expect(failed(screenFocusChecks('about', { focusInside: true, pageInert: true, titleBarReachable: true, dockReachable: true }))).toEqual([]);
    expect(failed(screenFocusChecks('about', { focusInside: false, pageInert: false, titleBarReachable: false, dockReachable: false })))
      .toEqual(['about-focus-in', 'about-page-inert', 'about-title-bar-usable', 'about-dock-usable']);
  });

  it('skips the title bar and dock checks when the window has neither', () => {
    expect(screenFocusChecks('about', { focusInside: true, pageInert: true, titleBarReachable: null, dockReachable: null }).map((check) => check.id))
      .toEqual(['about-focus-in', 'about-page-inert']);
  });
});

describe('pageHeaderChecks', () => {
  it('needs the page header with an icon and the expected title', () => {
    expect(failed(pageHeaderChecks('credits', 'Credits', { shown: true, icon: true, title: 'Credits' }))).toEqual([]);
    expect(failed(pageHeaderChecks('about', null, { shown: true, icon: true, title: 'Brock' }))).toEqual([]);
    expect(failed(pageHeaderChecks('credits', 'Credits', { shown: true, icon: false, title: 'Credits' }))).toEqual(['credits-page-header']);
    expect(failed(pageHeaderChecks('credits', 'Credits', { shown: false, icon: false, title: null }))).toEqual(['credits-page-header']);
  });
});

describe('aboutChecks', () => {
  it('compares the version row with the app version', () => {
    expect(failed(aboutChecks({ logoLoaded: true, version: '1.0.0', appVersion: '1.0.0' }))).toEqual([]);
    expect(failed(aboutChecks({ logoLoaded: null, version: '0.0.0', appVersion: '1.0.0' }))).toEqual(['about-logo', 'about-version']);
  });
});

describe('iconSlotChecks', () => {
  const known = (text: string): boolean => ['house', 'info'].includes(text);

  it('flags an icon name printed as text', () => {
    const outcomes = iconSlotChecks('palette-icons', [
      { label: 'Home', text: 'house', hasElement: false },
      { label: 'About', text: '', hasElement: true },
    ], known);
    expect(outcomes).toEqual([{ id: 'palette-icons', pass: false, reason: 'icon names shown as text on Home ("house")' }]);
  });

  it('accepts drawn icons and plain glyphs', () => {
    expect(failed(iconSlotChecks('palette-icons', [{ label: 'Star', text: '*', hasElement: false }], known))).toEqual([]);
  });
});

describe('viewMenuChecks', () => {
  it('passes a View sub-menu with the pin and full screen', () => {
    expect(failed(viewMenuChecks({ open: true, labels: ['Pin window on top', 'Fullscreen'] }, ['Pin window on top', 'Fullscreen']))).toEqual([]);
  });

  it('names a missing item and a sub-menu that did not open', () => {
    expect(reasonOf(viewMenuChecks({ open: true, labels: ['Fullscreen'] }, ['Pin window on top', 'Fullscreen']), 'menu-view-items')).toBe('the View sub-menu lacks Pin window on top');
    expect(failed(viewMenuChecks({ open: false, labels: [] }, ['Fullscreen']))).toEqual(['menu-view-opens']);
  });
});

describe('updaterChecks', () => {
  it('passes a title bar with no version tag and no update status before any check', () => {
    expect(failed(updaterChecks({ versionShown: false, statusShown: false }))).toEqual([]);
  });

  it('fails a permanent version tag and an update status nobody found an update for', () => {
    expect(failed(updaterChecks({ versionShown: true, statusShown: true }))).toEqual(['no-version-tag', 'no-update-status']);
  });
});
