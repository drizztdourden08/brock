/* @layer renderer-shell @kind types */
import type { ScreenRenderContext } from '../../../../screens/screen.type';
import type { HubDef } from '../../../hub.type';

interface HubHeaderTabsProps {
  def: HubDef;
  ctx: ScreenRenderContext;
}

export type { HubHeaderTabsProps };
