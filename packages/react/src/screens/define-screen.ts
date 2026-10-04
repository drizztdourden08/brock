/* @layer renderer-shell @kind logic */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import { iconNode } from './conventions/icon-node';
import type { ScreenDef, ScreenInput } from './screen.type';

const isIconName = (icon: ScreenInput['icon']): icon is IconName => typeof icon === 'string';

const defineScreen = (def: ScreenInput): ScreenDef => ({
  layer: 'fullscreen',
  header: 'page',
  keepMounted: false,
  devOnly: false,
  requiresProfile: true,
  ...def,
  icon: isIconName(def.icon) ? iconNode(def.icon) : def.icon,
});

export { defineScreen };
