/* @layer renderer-shell @kind logic */
import type { ScreenParams } from '../navigation/navigation.type';
import type { ScreenDef } from '../screens/screen.type';
import { HUB_DEFS } from './hub.constants';
import { hubBackLabel } from './hub-back-label';

const backLabelOf = (screen: ScreenDef, target: ScreenParams): string => {
  const hub = HUB_DEFS.get(screen);
  return hub === undefined ? screen.title : hubBackLabel(hub, target);
};

export { backLabelOf };
