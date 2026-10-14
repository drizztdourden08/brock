/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../../../menu/menu.type';
import { sectionOf } from './section-of';

const sameLabel = (a: string, b: string): boolean => a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0;

const sectionIds = (entries: readonly MenuEntry[]): string[] =>
  entries.flatMap((entry) => (entry !== 'separator' && entry.section !== undefined ? [entry.section] : []));

const sectionNamed = (label: string, ids: readonly string[]): string | null =>
  ids.find((id) => sameLabel(sectionOf(id).label, label)) ?? null;

const intoSection = (item: MenuItem, section: string): MenuItem[] =>
  (item.children ?? []).filter((child): child is MenuItem => child !== 'separator').map((child) => ({ ...child, section: child.section ?? section }));

const foldSectionMenus = (entries: readonly MenuEntry[], known: readonly MenuEntry[]): MenuEntry[] => {
  const ids = [...new Set(sectionIds([...entries, ...known]))];
  return entries.flatMap<MenuEntry>((entry) => {
    if (entry === 'separator' || entry.section !== undefined || !entry.children) return [entry];
    const section = sectionNamed(entry.label, ids);
    return section === null ? [entry] : intoSection(entry, section);
  });
};

export { foldSectionMenus };
