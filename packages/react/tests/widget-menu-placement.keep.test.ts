/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { createDefaultLayout } from '@drizztdourden08/tessera/composites';
import { buildMenu } from '../src/app/BrockApp/behavior/build-menu';
import { resolveShellMenu } from '../src/app/BrockApp/behavior/resolve-shell-menu';
import type { MenuBuildInput } from '../src/app/BrockApp/BrockApp.type';
import type { MenuConfig } from '../src/menu/menu-config.type';
import type { MenuEntry, MenuItem } from '../src/menu/menu.type';
import { arrangeWidgetMenu } from '../src/widgets/arrange-widget-menu';
import { buildWidgetMenuEntries } from '../src/widgets/build-widget-menu-entries';
import { defineWidget } from '../src/widgets/define-widget';

const noop = (): void => undefined;

const kit = (id: string, devOnly: boolean, extra: Partial<MenuItem> = {}): MenuItem => ({
  key: `kit-${id}`,
  label: id,
  ...(devOnly ? { devOnly } : {}),
  children: [{ key: `kit-${id}-open`, label: 'Open kit', onClick: noop }, 'separator', { key: `kit-${id}-reset`, label: 'Reset kit layout', onClick: noop }],
  ...extra,
});

const CLOCK: MenuItem = { key: 'widget-clock', label: 'Clock', onClick: noop };
const PROBE: MenuItem = { key: 'widget-probe', label: 'Probe', devOnly: true, onClick: noop };
const RESET: MenuItem = { key: 'widgets-reset-layout', label: 'Reset layout', onClick: noop };

const labels = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.label));
const keys = (entries: readonly MenuEntry[]): string[] => entries.map((entry) => (entry === 'separator' ? '|' : entry.key));

const find = (entries: readonly MenuEntry[], key: string): MenuItem | undefined => {
  for (const entry of entries) {
    if (entry === 'separator') continue;
    if (entry.key === key) return entry;
    const inside = entry.children ? find(entry.children, key) : undefined;
    if (inside) return inside;
  }
  return undefined;
};

const childrenOf = (entries: readonly MenuEntry[], key: string): MenuEntry[] => find(entries, key)?.children ?? [];

const shell = (items: readonly MenuItem[], developerTools: boolean, entries?: MenuConfig['entries']): MenuBuildInput => ({
  appMenu: [{ key: 'bucket:library', label: 'Library', screen: 'library' }],
  moduleMenu: [],
  widgets: [...arrangeWidgetMenu(items, entries, developerTools), RESET],
  homeScreen: 'hub',
  hasCredits: false,
  developerTools,
  onQuit: noop,
  onDevConsole: noop,
  onReportBug: noop,
  onShortcuts: noop,
  ...(entries === undefined ? {} : { menuConfig: { entries } }),
});

describe('the Developer submenu of Widgets', () => {
  it('collects the devOnly widgets and kits, with each kit still a submenu of its own', () => {
    const arranged = arrangeWidgetMenu([CLOCK, PROBE, kit('paint', false), kit('inspect', true)], undefined, true);
    expect(keys(arranged)).toEqual(['widget-clock', 'kit-paint', 'widgets-developer']);
    const developer = find(arranged, 'widgets-developer');
    expect(developer).toMatchObject({ label: 'Developer', devOnly: true });
    expect(keys(developer?.children ?? [])).toEqual(['widget-probe', 'kit-inspect']);
    expect(labels(childrenOf(arranged, 'kit-inspect'))).toEqual(['Open kit', '|', 'Reset kit layout']);
  });

  it('leaves no empty submenu without dev entries, and none while developer tools are off', () => {
    expect(keys(arrangeWidgetMenu([CLOCK, kit('paint', false)], undefined, true))).toEqual(['widget-clock', 'kit-paint']);
    expect(keys(arrangeWidgetMenu([CLOCK, PROBE, kit('inspect', true)], undefined, false))).toEqual(['widget-clock']);
  });

  it('takes any entry whose meta or config parent is widgets-developer, and lets the config keep a dev entry out', () => {
    const placed = { ...CLOCK, parent: 'widgets-developer' };
    expect(keys(childrenOf(arrangeWidgetMenu([placed], undefined, true), 'widgets-developer'))).toEqual(['widget-clock']);
    expect(find(arrangeWidgetMenu([placed], undefined, true), 'widget-clock')?.parent).toBeUndefined();
    const configured = arrangeWidgetMenu([CLOCK, PROBE], { 'widget-clock': { parent: 'widgets-developer' }, 'widget-probe': { parent: null } }, true);
    expect(keys(configured)).toEqual(['widget-probe', 'widgets-developer']);
    expect(keys(childrenOf(configured, 'widgets-developer'))).toEqual(['widget-clock']);
  });

  it('nests in the resolved menu: Widgets > Developer > kit > Open kit, and is gone with developer tools off', () => {
    const items = [CLOCK, PROBE, kit('inspect', true)];
    const on = buildMenu(shell(items, true));
    expect(labels(childrenOf(on, 'section:widgets'))).toEqual(['Clock', 'Developer', 'Reset layout']);
    expect(labels(childrenOf(on, 'widgets-developer'))).toEqual(['Probe', 'inspect']);
    expect(labels(childrenOf(on, 'kit-inspect'))).toEqual(['Open kit', '|', 'Reset kit layout']);
    const off = buildMenu(shell(items, false));
    expect(labels(childrenOf(off, 'section:widgets'))).toEqual(['Clock', 'Reset layout']);
    expect(find(off, 'widgets-developer')).toBeUndefined();
  });

  it('takes a label from the menu config, with no issue while it is absent', () => {
    const entries = { 'widgets-developer': { label: 'Dev tools' } };
    expect(find(buildMenu(shell([PROBE], true, entries)), 'widgets-developer')?.label).toBe('Dev tools');
    expect(resolveShellMenu(shell([PROBE], false, entries)).issues).toEqual([]);
    expect(resolveShellMenu(shell([CLOCK], true, entries)).issues).toEqual([]);
  });
});

describe('widget and kit placement', () => {
  it('turns meta.menu into the entry placement', () => {
    const def = defineWidget({ id: 'tuner', label: 'Tuner', devOnly: true, menu: { parent: 'audio', group: 'modules', order: 2 }, render: () => null });
    const [entry] = buildWidgetMenuEntries([def], createDefaultLayout(), noop, true);
    expect(entry).toMatchObject({ key: 'widget-tuner', devOnly: true, parent: 'audio', group: 'modules', order: 2 });
  });

  it('creates a missing parent submenu inside Widgets, labelled from its key, which the config can rename', () => {
    const tuner = { ...CLOCK, key: 'widget-tuner', label: 'Tuner', parent: 'audio-tools' };
    const meter = { ...CLOCK, key: 'widget-meter', label: 'Meter', parent: 'audio-tools' };
    const menu = buildMenu(shell([CLOCK, tuner, meter], true));
    expect(labels(childrenOf(menu, 'section:widgets'))).toEqual(['Clock', 'Audio tools', 'Reset layout']);
    expect(labels(childrenOf(menu, 'audio-tools'))).toEqual(['Tuner', 'Meter']);
    const renamed = resolveShellMenu(shell([tuner], true, { 'audio-tools': { label: 'Audio' } }));
    expect(find(renamed.entries, 'audio-tools')?.label).toBe('Audio');
    expect(renamed.issues).toEqual([]);
  });

  it('creates a submenu from the config parent of a widget, a kit or the Developer submenu', () => {
    const entries = { 'widget-clock': { parent: 'clocks' }, 'kit-paint': { parent: 'clocks' }, 'widgets-developer': { parent: 'extras', label: 'Dev' } };
    const resolved = resolveShellMenu(shell([CLOCK, PROBE, kit('paint', false)], true, entries));
    expect(resolved.issues).toEqual([]);
    expect(labels(childrenOf(resolved.entries, 'section:widgets'))).toEqual(['Clocks', 'Extras', 'Reset layout']);
    expect(keys(childrenOf(resolved.entries, 'clocks'))).toEqual(['widget-clock', 'kit-paint']);
    expect(labels(childrenOf(resolved.entries, 'extras'))).toEqual(['Dev']);
  });

  it('files an entry into a submenu that already exists, kit submenus included', () => {
    const resolved = resolveShellMenu(shell([CLOCK, kit('paint', false)], true, { 'widget-clock': { parent: 'kit-paint' } }));
    expect(keys(childrenOf(resolved.entries, 'kit-paint'))).toContain('widget-clock');
    expect(resolved.issues).toEqual([]);
  });

  it('creates no submenu for other entries, which still report an unknown parent', () => {
    const resolved = resolveShellMenu(shell([CLOCK], true, { 'bucket:library': { parent: 'nowhere' } }));
    expect(find(resolved.entries, 'nowhere')).toBeUndefined();
    expect(resolved.issues.map((issue) => issue.message).join('\n')).toContain('"nowhere"');
  });

  it('keeps a parent named only by a devOnly widget a known key while developer tools are off', () => {
    const tuner = { ...PROBE, parent: 'audio-tools' };
    const input = shell([tuner], false, { 'audio-tools': { label: 'Audio' } });
    expect(resolveShellMenu({ ...input, widgets: [tuner, RESET] }).issues).toEqual([]);
    expect(find(buildMenu({ ...input, widgets: [tuner, RESET] }), 'audio-tools')).toBeUndefined();
  });
});
