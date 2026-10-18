/* @layer renderer-shell @kind logic */
import { HUB_DEFS, HUB_WINDOW_KEY } from '../../../hub/hub.constants';
import type { ScreenDef } from '../../screen.type';

const layerKeyOf = (screen: ScreenDef): string => (HUB_DEFS.has(screen) ? HUB_WINDOW_KEY : screen.id);

export { layerKeyOf };
