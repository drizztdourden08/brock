/* @layer renderer-shell @kind logic */
import type { ScreenDef } from './screen.type';

const defineScreen = (def: ScreenDef): ScreenDef => ({
  layer: 'fullscreen',
  header: 'page',
  keepMounted: false,
  devOnly: false,
  requiresProfile: true,
  ...def,
});

export { defineScreen };
