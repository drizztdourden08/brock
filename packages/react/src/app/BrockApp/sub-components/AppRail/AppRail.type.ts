/* @layer renderer-shell @kind types */
import type { ScreenDef } from '../../../../screens/screen.type';
import type { ScreenRailGroup } from '../../../../shell/ScreenRail/ScreenRail.type';

interface AppRailProps {
  screens: readonly ScreenDef[];
  home: string;
  groups?: readonly ScreenRailGroup[];
}

export type { AppRailProps };
