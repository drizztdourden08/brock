/* @layer renderer-shell @kind logic */
import { MENU_SECTIONS } from '../../../menu/menu.constants';
import type { MenuEntry, MenuItem } from '../../../menu/menu.type';
import { sectionOf } from './section-of';

const sectionOrder = (ids: readonly string[]): string[] => [
  ...MENU_SECTIONS.map((section) => section.id).filter((id) => ids.includes(id)),
  ...ids.filter((id) => !MENU_SECTIONS.some((section) => section.id === id)),
];

const groupSections = (entries: readonly MenuEntry[]): MenuItem[] => {
  const members = new Map<string, MenuItem[]>();
  for (const entry of entries) {
    if (entry === 'separator' || entry.section === undefined) continue;
    members.set(entry.section, [...(members.get(entry.section) ?? []), entry]);
  }
  return sectionOrder([...members.keys()]).map((id) => {
    const { label, icon } = sectionOf(id);
    return { key: `section:${id}`, label, icon, children: members.get(id) ?? [] };
  });
};

export { groupSections };
