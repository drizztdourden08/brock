/* @layer renderer-shell @kind logic */
import { registerDeviceCardActions } from '../register-device-card-actions';
import { registerGlyphSource } from '../register-glyph-source';
import { registerRumbleTests } from '../register-rumble-tests';
import type { ControllerHooksConfig } from './controller-hooks.type';

const registerControllerHooks = (config: ControllerHooksConfig): void => {
  if (config.actions) registerDeviceCardActions(config.actions);
  if (config.rumbleTests) registerRumbleTests(config.rumbleTests);
  if (config.glyphSource) registerGlyphSource(config.glyphSource);
};

export { registerControllerHooks };
