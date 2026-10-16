/* @layer renderer-shell @kind logic */
import type { WidgetDef } from '../widget.type';
import type { WidgetKitDef } from './widget-kit.type';

const groupedMembers = (definitions: readonly WidgetDef[], kits: readonly WidgetKitDef[]): WidgetDef[] =>
  definitions.flatMap((def) => (def.kit !== undefined && kits.some((kit) => kit.id === def.kit) ? [{ ...def, group: def.kit }] : []));

export { groupedMembers };
