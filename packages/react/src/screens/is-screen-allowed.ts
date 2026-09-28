/* @layer renderer-shell @kind logic */
import type { ScreenDef } from './screen.type';

const isScreenAllowed = (screen: ScreenDef, developerTools: boolean, hasProfile: boolean): boolean =>
  (!screen.devOnly || developerTools) && (screen.requiresProfile === false || hasProfile);

export { isScreenAllowed };
