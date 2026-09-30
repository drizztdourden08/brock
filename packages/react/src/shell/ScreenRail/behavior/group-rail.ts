/* @layer renderer-shell @kind logic */
import type { SectionNavGroup } from '@drizztdourden08/tessera/composites';
import type { ScreenDef } from '../../../screens/screen.type';
import { UNGROUPED_ID } from '../ScreenRail.constants';
import type { ScreenRailGroup } from '../ScreenRail.type';

const groupRail = (screens: readonly ScreenDef[], labels: readonly ScreenRailGroup[], hasProfile: boolean): SectionNavGroup[] => {
  const ungrouped: SectionNavGroup = { id: UNGROUPED_ID, items: [] };
  const grouped: SectionNavGroup[] = [];
  for (const screen of screens) {
    const item = { id: screen.id, label: screen.title, icon: screen.icon, disabled: screen.requiresProfile !== false && !hasProfile };
    if (screen.group === undefined) { ungrouped.items.push(item); continue; }
    const found = grouped.find((g) => g.id === screen.group);
    if (found) { found.items.push(item); continue; }
    const label = labels.find((g) => g.id === screen.group)?.label ?? screen.group;
    grouped.push({ id: screen.group, label, items: [item] });
  }
  return ungrouped.items.length > 0 ? [ungrouped, ...grouped] : grouped;
};

export { groupRail };
