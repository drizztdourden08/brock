/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { rankOrder } from '../src/hub/Hub/behavior/rank-order';
import { rankedJumps } from '../src/hub/Hub/behavior/ranked-jumps';
import type { HubDef, HubPage } from '../src/hub/hub.type';
import { paletteGroups } from '../src/palette/PaletteHost/behavior/palette-groups';
import { placeMenuItems } from '../src/screens/conventions/place-menu-items';
import { rankEntries } from '../src/search/rank-entries';
import { rankInScope } from '../src/search/rank-in-scope';
import type { SearchEntry } from '../src/search/search.type';

const entry = (id: string, label: string, route: string, kind: SearchEntry['kind'] = 'page'): SearchEntry => ({
  id, kind, label, keywords: [], breadcrumb: [], target: { route },
});

const CATALOG: SearchEntry[] = [
  entry('screen:about', 'About sessions', 'about', 'screen'),
  entry('screen:data/sessions', 'Session runs', 'data/sessions'),
  entry('screen:multiworld/sessions', 'Sessions', 'multiworld/sessions'),
  entry('setting:sessionLimit', 'Session limit', 'multiworld/engine', 'setting'),
  entry('screen:multiworld/sessions/new', 'New session', 'multiworld/sessions/new'),
];

const page = (id: string, label: string): HubPage => ({ id, label, icon: null, render: () => null });
const PAGES = [page('home', 'Home'), page('engine', 'Engine'), page('sessions', 'Sessions')];
const HUB: HubDef = { id: 'multiworld', title: 'Multiworld', icon: null, home: PAGES[0] ?? page('home', 'Home'), groups: [{ id: 'g', label: 'G', pages: PAGES.slice(1) }] };

describe('one ranking, scoped to the open hub', () => {
  it('splits the shared ranking into the open hub first and the rest after', () => {
    const { inScope, rest } = rankInScope(CATALOG, 'session', 'multiworld');
    const ranked = rankEntries(CATALOG, 'session').map((candidate) => candidate.id);
    expect([...inScope, ...rest].map((candidate) => candidate.id).sort()).toEqual([...ranked].sort());
    expect(inScope.map((candidate) => candidate.id)).toEqual(ranked.filter((id) => id.includes('multiworld') || id === 'setting:sessionLimit'));
  });

  it('labels the palette groups with the hub, and keeps one list outside a hub', () => {
    const scoped = paletteGroups(CATALOG, 'session', { bucket: 'multiworld', title: 'Multiworld' });
    expect(scoped.map((group) => group.label)).toEqual(['In Multiworld', 'Everywhere else']);
    expect(paletteGroups(CATALOG, 'session').map((group) => group.id)).toEqual(['results']);
    const idle = paletteGroups(CATALOG, '', { bucket: 'multiworld', title: 'Multiworld' });
    expect(idle.map((group) => [group.label, group.items.length])).toEqual([['Multiworld', 2], ['Screens', 1]]);
  });

  it('orders the hub search groups and page jumps by the same ranking', () => {
    const ranked = rankEntries(CATALOG.filter((candidate) => candidate.target?.route.startsWith('multiworld')), 'session');
    const order = rankOrder(HUB, PAGES, ranked);
    expect(['engine', 'sessions', 'home'].sort((a, b) => order(a) - order(b))).toEqual(['sessions', 'engine', 'home']);
    expect(rankedJumps(HUB, PAGES, ranked).map((jump) => jump.id)).toEqual(['sessions']);
  });
});

describe('placeMenuItems', () => {
  it('turns an existing entry into a submenu that keeps the entry first', () => {
    const items = placeMenuItems(
      [{ key: 'bucket:data', label: 'Data', icon: 'hard-drive', screen: 'data' }],
      [{ path: ['data'], item: { key: 'screen:changelog', label: 'Changelog', screen: 'changelog' }, order: 1 }],
      () => undefined,
    );
    expect(items).toEqual([{
      key: 'bucket:data:menu',
      label: 'Data',
      icon: 'hard-drive',
      devOnly: undefined,
      children: [{ key: 'bucket:data', label: 'Data', icon: 'hard-drive', screen: 'data' }, { key: 'screen:changelog', label: 'Changelog', screen: 'changelog' }],
    }]);
  });
});
