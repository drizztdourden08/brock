/* @layer renderer-shell @kind logic */
import type { WidgetDef } from '../widget.type';

const kitMembers = (kitId: string, members: readonly WidgetDef[]): WidgetDef[] => members.filter((def) => def.kit === kitId);

export { kitMembers };
