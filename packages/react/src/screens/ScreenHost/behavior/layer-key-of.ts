/* @layer renderer-shell @kind logic */
import { HUB_WINDOW_KEY } from '../../../hub/hub.constants';
import type { ScreenDef } from '../../screen.type';
import { isHubWindow } from './is-hub-window';

const layerKeyOf = (screen: ScreenDef): string => (isHubWindow(screen) ? HUB_WINDOW_KEY : screen.id);

export { layerKeyOf };
