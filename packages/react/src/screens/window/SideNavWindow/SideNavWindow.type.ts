/* @layer renderer-shell @kind types */
import type { CardProps } from '../../kinds/screen-kinds.type';
import type { WindowDef } from '../window.type';

interface SideNavWindowProps {
  def: WindowDef;
  ctx: CardProps;
}

export type { SideNavWindowProps };
