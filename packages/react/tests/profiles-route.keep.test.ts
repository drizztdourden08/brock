/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { defineProduct } from '@drizztdourden08/brock-core';
import { profilesAlias } from '../src/app/BrockApp/behavior/profiles-alias';
import { nav } from '../src/navigation/nav';
import { restoreNavigation } from '../src/navigation/restore-navigation';
import { routeAliases } from '../src/navigation/route-aliases';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { createBuiltInScreens } from '../src/screens/built-in/built-in-screens';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import { isScreenAllowed } from '../src/screens/is-screen-allowed';
import { isProfilesRoute } from '../src/stores/is-profiles-route';
import { PROFILES_SCREEN } from '../src/stores/profiles.constants';

const removals: (() => void)[] = [];

const aliasTo = (route: string): void => {
  const alias = profilesAlias(route);
  if (alias) removals.push(routeAliases.add(PROFILES_SCREEN, alias));
};

afterEach(() => {
  for (const remove of removals.splice(0)) remove();
  useNavigationStore.getState().restore(null);
});

describe('the profiles route an app names', () => {
  it('sends every open of the profiles screen to the app page', () => {
    aliasTo('data/profiles');
    nav.open(PROFILES_SCREEN);
    const { active, params } = useNavigationStore.getState();
    expect([active, params.section]).toEqual(['data', 'profiles']);
    expect(isProfilesRoute(active, params)).toBe(true);
    expect(isProfilesRoute('data', { section: 'storage' })).toBe(false);
  });

  it('counts the app page as the startup state, so a saved screen still takes over', () => {
    aliasTo('data/profiles');
    nav.open(PROFILES_SCREEN);
    restoreNavigation({ active: 'game', params: {}, history: {}, remembered: {} }, 'game');
    expect(useNavigationStore.getState().active).toBe('game');
  });

  it('leaves the built-in screen out when the app names a route, and keeps everything as it was without one', () => {
    expect(profilesAlias(undefined)).toBeNull();
    expect(createBuiltInScreens({ profiles: false }).map((screen) => screen.id)).not.toContain(PROFILES_SCREEN);
    expect(createBuiltInScreens({}).map((screen) => screen.id)).toContain(PROFILES_SCREEN);
    expect(isProfilesRoute(PROFILES_SCREEN, {})).toBe(true);
    const base = { id: 'demo', name: 'Demo', appId: 'com.example.demo', author: { name: 'Example' } };
    expect(defineProduct(base).profilesRoute).toBeUndefined();
    expect(defineProduct({ ...base, profilesRoute: 'data/profiles' }).profilesRoute).toBe('data/profiles');
  });
});

describe('a bucket reachable without a profile', () => {
  it('passes requiresProfile from the bucket to its hub screen', () => {
    const View = () => null;
    const tree = resolveScreenTree(buildScreenTree(
      { buckets: [{ id: 'game', title: 'Game', icon: 'house', menu: 'entry' }, { id: 'data', title: 'Data', icon: 'database', menu: 'entry', requiresProfile: false }], home: 'game' },
      [{ kind: 'page', bucket: 'game', id: 'play', component: View }, { kind: 'page', bucket: 'data', id: 'profiles', component: View }],
    ), []);
    const screen = (id: string) => tree.screens.find((candidate) => candidate.id === id);
    expect(screen('data')?.requiresProfile).toBe(false);
    expect(screen('game')?.requiresProfile).toBe(true);
    const data = screen('data');
    const game = screen('game');
    expect(data && isScreenAllowed(data, false, false)).toBe(true);
    expect(game && isScreenAllowed(game, false, false)).toBe(false);
  });
});
