/* @layer renderer-shell @kind logic */
import { HUB_DEFS } from '../../../hub/hub.constants';
import type { ScreenDef } from '../../screen.type';

const isHubWindow = (screen: ScreenDef): boolean => HUB_DEFS.has(screen) || screen.bare === true;

export { isHubWindow };
