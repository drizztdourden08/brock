/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { buildHubNav } from '../src/hub/Hub/behavior/build-hub-nav';
import { splitTopPages } from '../src/hub/Hub/behavior/split-top-pages';
import type { HubGroup, HubPage } from '../src/hub/hub.type';

const page = (id: string): HubPage => ({ id, label: id.toUpperCase(), icon: null, render: () => null });

const HOME = page('home');
const GROUPS: HubGroup[] = [
  { id: 'work', label: 'Work', pages: [page('sessions'), page('tasks'), page('plans')] },
  { id: 'more', label: 'More', pages: [page('notes'), page('logs')] },
];

const idsOf = (items: readonly { id: string }[] | undefined): string[] => (items ?? []).map((item) => item.id);

describe('the hub side nav top group', () => {
  it('puts the top pages under Home in the order the hub lists them', () => {
    const nav = buildHubNav(HOME, GROUPS, undefined, ['notes', 'sessions']);
    expect(nav.home?.id).toBe('home');
    expect(idsOf(nav.top)).toEqual(['notes', 'sessions']);
  });

  it('takes the top pages out of their groups and drops a group left empty', () => {
    const nav = buildHubNav(HOME, GROUPS, undefined, ['sessions', 'notes', 'logs']);
    expect(nav.groups.map((group) => [group.id, idsOf(group.items)])).toEqual([['work', ['tasks', 'plans']]]);
  });

  it('leaves the nav as it was with no top list or an empty one', () => {
    expect(buildHubNav(HOME, GROUPS)).not.toHaveProperty('top');
    expect(buildHubNav(HOME, GROUPS, undefined, [])).not.toHaveProperty('top');
    expect(idsOf(buildHubNav(HOME, GROUPS).groups)).toEqual(['work', 'more']);
  });

  it('skips an id that is not a shown page and a repeated id', () => {
    const nav = buildHubNav(HOME, GROUPS, undefined, ['unknown', 'tasks', 'tasks']);
    expect(idsOf(nav.top)).toEqual(['tasks']);
    expect(nav.groups.flatMap((group) => idsOf(group.items))).toEqual(['sessions', 'plans', 'notes', 'logs']);
  });

  it('builds the top items like any other nav item', () => {
    const picked: string[] = [];
    const nav = buildHubNav(HOME, GROUPS, (id) => picked.push(id), ['sessions']);
    nav.top?.[0]?.onHighlight?.();
    expect(picked).toEqual(['sessions']);
    expect(nav.top?.[0]?.label).toBe('SESSIONS');
  });

  it('does not change the groups it was given', () => {
    const split = splitTopPages(GROUPS, ['sessions']);
    expect(split.top.map((entry) => entry.id)).toEqual(['sessions']);
    expect(GROUPS[0]?.pages).toHaveLength(3);
  });
});
