/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PalettePick, PickOption } from '../src/palette/palette.type';
import { palette } from '../src/palette/palette';
import { pickGroups } from '../src/palette/PaletteHost/behavior/pick-groups';
import { scopeDirection } from '../src/palette/PaletteHost/behavior/pick-scope-keys';
import { usePickScopes } from '../src/palette/PaletteHost/behavior/usePickScopes';
import type { PickScopeModel } from '../src/palette/PaletteHost/PaletteHost.type';
import { stepScope } from '../src/palette/step-scope';
import { usePaletteStore } from '../src/palette/usePaletteStore';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let root: Root | null = null;

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  palette.close();
});

const option = (value: string, extra: Partial<PickOption> = {}): PickOption => ({ value, label: value, ...extra });

const RECENT = [option('alpha.png'), option('beta.png')];
const PROJECT = [option('gamma.png', { group: 'art', keywords: ['cover'] }), option('delta.png', { group: 'docs' })];

const probe = (): { latest: () => PickScopeModel } => {
  let seen: PickScopeModel = { options: [], scope: null, placeholder: undefined };
  const Probe = () => {
    seen = usePickScopes(usePaletteStore((s) => s.picking));
    return null;
  };
  root = createRoot(document.createElement('div'));
  act(() => root?.render(createElement(Probe)));
  return { latest: () => seen };
};

const pressTab = (shiftKey = false): void => {
  act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true })); });
};

type PickGroup = ReturnType<typeof pickGroups>[number];

const itemLabels = (group: PickGroup): ReactNode[] => group.items.map((item) => item.label);

const groupSummary = (group: PickGroup): [string, ReactNode, ReactNode[]] => [group.id, group.label, itemLabels(group)];

describe('K1 scoped pick', () => {
  it('opens in the given scope and Tab and Shift+Tab move between scopes', { tags: ['critical'] }, () => {
    const view = probe();
    act(() => palette.pick({
      title: 'Open file',
      scopes: [{ id: 'recent', label: 'Recent', options: RECENT }, { id: 'project', label: 'Project', options: PROJECT }],
      scope: 'project',
      onPick: () => undefined,
    }));
    expect(view.latest().scope).toBe('project');
    expect(view.latest().placeholder).toBe('Search Project, Tab for Recent');
    pressTab();
    expect(view.latest().scope).toBe('recent');
    expect(view.latest().options).toEqual(RECENT);
    pressTab(true);
    expect(view.latest().scope).toBe('project');
  });

  it('loads a lazy scope once, on its first visit', { tags: ['critical'] }, async () => {
    const load = vi.fn(() => Promise.resolve(PROJECT));
    const view = probe();
    act(() => palette.pick({
      title: 'Open file',
      scopes: [{ id: 'recent', label: 'Recent', options: RECENT }, { id: 'project', label: 'Project', options: load }],
      onPick: () => undefined,
    }));
    expect(load).not.toHaveBeenCalled();
    pressTab();
    await act(async () => { await Promise.resolve(); });
    expect(view.latest().options).toEqual(PROJECT);
    pressTab();
    pressTab();
    await act(async () => { await Promise.resolve(); });
    expect(load).toHaveBeenCalledTimes(1);
    expect(view.latest().options).toEqual(PROJECT);
  });

  it('hands the scope id to onPick', { tags: ['critical'] }, () => {
    const onPick = vi.fn();
    const pick: PalettePick = { title: 'Open file', scopes: [{ id: 'recent', label: 'Recent', options: RECENT }], onPick };
    pickGroups(pick, '', RECENT, 'recent')[0]?.items[1]?.run();
    expect(onPick).toHaveBeenCalledWith('beta.png', 'recent');
  });

  it('keeps a flat pick as it was: label filter, one group, null scope', { tags: ['critical'] }, () => {
    const onPick = vi.fn();
    const pick: PalettePick = { title: 'Size', options: [option('small'), option('large')], onPick };
    const groups = pickGroups(pick, 'LAR', pick.options ?? [], null);
    expect(groups.map(groupSummary)).toEqual([['pick', 'Size', ['large']]]);
    groups[0]?.items[0]?.run();
    expect(onPick).toHaveBeenCalledWith('large', null);
  });
});

describe('S1 ranking and groups', () => {
  const pick: PalettePick = { title: 'Open file', scopes: [{ id: 'project', label: 'Project', options: PROJECT }], onPick: () => undefined };

  it('ranks a scoped pick by label, keywords and description', { tags: ['standard'] }, () => {
    const options = [option('cover-note.txt'), option('b.png', { keywords: ['cover'] }), option('c.png', { description: 'the cover art' }), option('d.png')];
    const labels = pickGroups(pick, 'cover', options, 'project').flatMap(itemLabels);
    expect(labels).toEqual(['cover-note.txt', 'b.png', 'c.png']);
  });

  it('splits results into groups by first appearance and keeps the title for the rest', { tags: ['standard'] }, () => {
    const options = [...PROJECT, option('loose.png')];
    const groups = pickGroups(pick, '', options, 'project');
    expect(groups.map((group) => group.label)).toEqual(['art', 'docs', 'Open file']);
  });

  it('answers one empty group when nothing matches', { tags: ['standard'] }, () => {
    const groups = pickGroups(pick, 'zzz', PROJECT, 'project');
    expect(groups).toEqual([{ id: 'pick', label: 'Open file', items: [] }]);
  });
});

describe('S2 scope steps', () => {
  const scopes = [{ id: 'a', label: 'A', options: [] }, { id: 'b', label: 'B', options: [] }, { id: 'c', label: 'C', options: [] }];

  it('wraps around in both directions', { tags: ['standard'] }, () => {
    expect(stepScope(scopes, 'c', 1)?.id).toBe('a');
    expect(stepScope(scopes, 'a', -1)?.id).toBe('c');
    expect(stepScope([], null, 1)).toBeUndefined();
  });

  it('reads only a plain Tab as a scope key', { tags: ['standard'] }, () => {
    const key = { key: 'Tab', shiftKey: false, ctrlKey: false, altKey: false, metaKey: false };
    expect(scopeDirection(key)).toBe(1);
    expect(scopeDirection({ ...key, shiftKey: true })).toBe(-1);
    expect(scopeDirection({ ...key, ctrlKey: true })).toBe(0);
    expect(scopeDirection({ ...key, key: 'a' })).toBe(0);
  });
});
