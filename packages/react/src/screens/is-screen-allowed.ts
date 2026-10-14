/* @layer renderer-shell @kind logic */
import type { ScreenDef } from './screen.type';
import { isShown } from './show/is-shown';
import type { ShowContext } from './show/show.type';

const isScreenAllowed = (screen: ScreenDef, developerTools: boolean, hasProfile: boolean, show?: ShowContext): boolean =>
  (!screen.devOnly || developerTools) && (screen.requiresProfile === false || hasProfile) && isShown(screen.show, show);

export { isScreenAllowed };
