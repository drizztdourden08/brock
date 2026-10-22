/* @layer renderer-shell @kind logic */
import { HUB_DEFS, HUB_WINDOW_KEY } from '../../../hub/hub.constants';
import type { ScreenDef } from '../../screen.type';

const freeFrameOf = (screen: ScreenDef): { free: string; icon: ScreenDef['icon']; cornerTitle: boolean } => ({
  free: HUB_WINDOW_KEY,
  icon: screen.icon,
  cornerTitle: !HUB_DEFS.has(screen),
});

export { freeFrameOf };
