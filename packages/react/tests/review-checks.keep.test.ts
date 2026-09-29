/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { MenuEntry } from '../src/menu/menu.type';
import { aboutChecks } from '../src/review/checks/about-checks';
import { bootChecks } from '../src/review/checks/boot-checks';
import { frameChecks } from '../src/review/checks/frame-checks';
import { iconSlotChecks } from '../src/review/checks/icon-slot-checks';
import { menuChecks } from '../src/review/checks/menu-checks';
import { menuExpectation } from '../src/review/menu/menu-expectation';
import { menuPathTo } from '../src/review/menu/menu-path-to';
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
  slotsRendered: [true, true],
  expectedSlots: 2,
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
    const outcomes = bootChecks({ ...BOOT, title: 'Other', logoLoaded: false, slotsRendered: [true, false] });
    expect(failed(outcomes)).toEqual(['title-text', 'title-bar-logo', 'title-bar-slots']);
    expect(reasonOf(outcomes, 'title-bar-slots')).toBe('title bar slot 2 rendered nothing');
  });

  it('fails a missing slot', () => {
    expect(reasonOf(bootChecks({ ...BOOT, slotsRendered: [true] }), 'title-bar-slots')).toBe('1 of 2 title bar slots mounted');
  });
});

describe('menuExpectation', () => {
  it('drops Settings when it is the home screen and takes labels from the built menu', () => {
    expect(menuExpectation(MENU, 'settings')).toEqual({ required: ['Home', 'Profiles', 'About', 'Quit'], sections: ['Advanced'] });
  });

  it('asks for Settings when home is elsewhere', () => {
    const hubMenu: MenuEntry[] = [{ key: 'home', label: 'Home', screen: 'hub' }, ...MENU.slice(1)];
    expect(menuExpectation(hubMenu, 'hub').required).toEqual(['Home', 'Profiles', 'Settings', 'About', 'Quit']);
  });
});

describe('menuChecks', () => {
  const expected = { required: ['Home', 'Quit'], sections: ['Advanced'] };

  it('passes a full menu', () => {
    expect(failed(menuChecks({ open: true, items: [item('Home'), item('Advanced', true, true), item('Quit')] }, expected))).toEqual([]);
  });

  it('reports a closed menu once', () => {
    expect(menuChecks({ open: false, items: [] }, expected)).toEqual([{ id: 'menu-opens', pass: false, reason: 'the menu did not open' }]);
  });

  it('catches missing entries, sections and icons', () => {
    const outcomes = menuChecks({ open: true, items: [item('Home', false)] }, expected);
    expect(failed(outcomes)).toEqual(['menu-entries', 'menu-sections', 'menu-icons']);
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
