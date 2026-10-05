/* @layer renderer-shell @kind logic */
import type { ScreenParams } from '../navigation/navigation.type';
import type { ScreenDef } from '../screens/screen.type';
import { resolveHubPage } from './Hub/behavior/resolve-hub-page';
import { HUB_DEFS } from './hub.constants';

const backLabelOf = (screen: ScreenDef, target: ScreenParams): string => {
  const hub = HUB_DEFS.get(screen);
  if (hub === undefined) return screen.title;
  const { page, sub } = resolveHubPage([hub.home, ...hub.groups.flatMap((group) => group.pages)], hub.home, target);
  return sub?.label ?? page.label;
};

export { backLabelOf };
