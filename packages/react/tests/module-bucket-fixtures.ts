/* @layer renderer-shell @kind test */
import type { MenuItem } from '../src/menu/menu.type';
import type { ModuleBucket } from '../src/modules/renderer-module.type';
import { buildScreenTree } from '../src/screens/conventions/build-screen-tree';
import type { BucketEntry } from '../src/screens/conventions/screen-tree.type';
import type { BucketDef } from '../src/screens/conventions/screens-config.type';

const View = () => null;

const CONTROLLERS: BucketDef = {
  id: 'controllers',
  title: 'Controllers',
  icon: 'gamepad-2',
  menu: 'hidden',
  switcher: false,
  groups: [{ id: 'tools', label: 'Tools' }],
};

const ENTRIES: BucketEntry[] = [
  { kind: 'page', bucket: 'controllers', id: 'directory', component: View, meta: { title: 'Pad directory', icon: 'folder', keywords: ['pads'] } },
  { kind: 'page', bucket: 'controllers', group: 'tools', id: 'logs', component: View },
];

const MODULE_BUCKET: ModuleBucket = { bucket: CONTROLLERS, entries: ENTRIES };

const MODULE_MENU: MenuItem = { key: 'controllers', label: 'Controllers', icon: 'gamepad-2', section: 'advanced', screen: 'controllers' };

const APP_TREE = buildScreenTree(
  { buckets: [{ id: 'game', title: 'Game', icon: 'house', menu: 'entry' }], home: 'game' },
  [{ kind: 'page', bucket: 'game', id: 'overview', component: View }],
);

export { APP_TREE, CONTROLLERS, MODULE_BUCKET, MODULE_MENU };
