/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { switcherHubs } from '../src/hub/Hub/behavior/switcher-hubs';
import { nav } from '../src/navigation/nav';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import type { BucketDef } from '../src/screens/conventions/screens-config.type';

const View = () => null;

const GAME: BucketDef = { id: 'game', title: 'Game', icon: 'house', menu: 'entry' };
const CONTROLLERS: BucketDef = { id: 'controllers', title: 'Controllers', icon: 'folder', menu: 'hidden', switcher: false };
const DATA: BucketDef = { id: 'data', title: 'Data', icon: 'database', menu: 'entry' };

const resolved = (buckets: BucketDef[]) => resolveScreenTree(
  buildScreenTree({ buckets, home: 'game' }, buckets.map((bucket) => ({ kind: 'page', bucket: bucket.id, id: 'pad', component: View }))),
  [],
);

afterEach(() => useNavigationStore.getState().restore(null));

describe('K1 a bucket kept out of the hub switcher', { tags: ['critical'] }, () => {
  it('carries switcher: false from the bucket to its hub, and shows by default', () => {
    const hubs = resolved([GAME, CONTROLLERS, DATA]).hubs;
    expect(hubs.map((hub) => hub.switcher)).toEqual([undefined, false, undefined]);
    expect(switcherHubs(hubs).map((hub) => hub.id)).toEqual(['game', 'data']);
  });

  it('still registers the screen and opens it by route', () => {
    expect(resolved([GAME, CONTROLLERS, DATA]).screens.map((screen) => screen.id)).toContain('controllers');
    nav.open('controllers/pad');
    const { active, params } = useNavigationStore.getState();
    expect([active, params.section]).toEqual(['controllers', 'pad']);
  });
});
