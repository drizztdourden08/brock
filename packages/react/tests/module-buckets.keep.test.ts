/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import type { MenuItem as TesseraMenuItem } from '@drizztdourden08/tessera/composites';
import { switcherHubs } from '../src/hub/Hub/behavior/switcher-hubs';
import { navResolver } from '../src/menu/nav-resolver';
import { toMenuGroups } from '../src/menu/to-menu-groups';
import { withRoutes } from '../src/menu/with-routes';
import { mergeModules } from '../src/modules/merge-modules';
import { nav } from '../src/navigation/nav';
import { useNavigationStore } from '../src/navigation/useNavigationStore';
import { moduleBucketScreens } from '../src/screens/conventions/module-bucket-screens';
import { resolveScreenTree } from '../src/screens/conventions/resolve-screen-tree';
import { withModuleBuckets } from '../src/screens/conventions/with-module-buckets';
import { createScreenRegistry } from '../src/screens/create-screen-registry';
import { APP_TREE, CONTROLLERS, MODULE_BUCKET, MODULE_MENU } from './module-bucket-fixtures';

const resolved = () => resolveScreenTree(withModuleBuckets(APP_TREE, [MODULE_BUCKET]), []);

afterEach(() => useNavigationStore.getState().restore(null));

describe('mergeModules', () => {
  it('collects the buckets of every module and none from a module without any', () => {
    expect(mergeModules([{ id: 'plain' }, { id: 'input', buckets: [MODULE_BUCKET] }]).buckets).toEqual([MODULE_BUCKET]);
    expect(mergeModules([{ id: 'plain' }]).buckets).toEqual([]);
  });
});

describe('a module bucket in the app screen tree', () => {
  it('adds the bucket, its hub and its search entries, and keeps the app buckets', () => {
    const tree = withModuleBuckets(APP_TREE, [MODULE_BUCKET]);
    expect(tree.config.buckets.map((bucket) => bucket.id)).toEqual(['game', 'controllers']);
    expect(tree.hubs.map((hub) => hub.id)).toEqual(['game', 'controllers']);
    expect(tree.search.map((entry) => entry.label)).toEqual(expect.arrayContaining(['Controllers', 'Pad directory', 'Logs']));
    expect(withModuleBuckets(APP_TREE, [])).toBe(APP_TREE);
  });

  it('registers the hub as a screen and opens it by route', () => {
    expect(resolved().screens.map((screen) => screen.id)).toContain('controllers');
    nav.open('controllers/logs');
    const { active, params } = useNavigationStore.getState();
    expect([active, params.section]).toEqual(['controllers', 'logs']);
  });

  it('opens from a module menu entry that points at its screen', () => {
    const [group] = toMenuGroups(withRoutes([MODULE_MENU]), navResolver);
    (group?.items[0] as TesseraMenuItem).onSelect?.();
    expect(useNavigationStore.getState().active).toBe('controllers');
  });

  it('stays out of the hub switcher and the derived menu with switcher false and menu hidden', () => {
    const tree = resolved();
    expect(switcherHubs(tree.hubs).map((hub) => hub.id)).toEqual(['game']);
    expect(tree.menu.some((entry) => entry !== 'separator' && entry.key.includes('controllers'))).toBe(false);
  });

  it('throws on a bucket id the app already declares, and on an entry of another bucket', () => {
    expect(() => withModuleBuckets(APP_TREE, [{ bucket: { ...CONTROLLERS, id: 'game' }, entries: [] }])).toThrow('module bucket "game"');
    expect(() => withModuleBuckets(APP_TREE, [MODULE_BUCKET, MODULE_BUCKET])).toThrow('module bucket "controllers"');
    const stray = { bucket: CONTROLLERS, entries: [{ kind: 'custom' as const, bucket: 'elsewhere', id: 'x', component: () => null }] };
    expect(() => withModuleBuckets(APP_TREE, [stray])).toThrow('names the bucket "elsewhere"');
  });
});

describe('a module bucket in an app with no screen tree', () => {
  it('gives each hub as a module screen so the bucket still opens', () => {
    const registry = createScreenRegistry(moduleBucketScreens([MODULE_BUCKET]));
    expect(registry.has('controllers')).toBe(true);
    nav.open('controllers');
    expect(useNavigationStore.getState().active).toBe('controllers');
  });
});
