/* @layer renderer-shell @kind logic */
import { SETTING_ID_PREFIX } from '../search.constants';
import type { IndexEntry, SearchSectionSeed } from '../search.type';

const sectionEntries = (page: IndexEntry, section: SearchSectionSeed): IndexEntry[] => {
  const route = page.target?.route ?? '';
  const crumbs = [...page.breadcrumb, page.label];
  const trail = section.sub === undefined ? [section.title] : [section.title, section.sub];
  const own: IndexEntry = {
    id: `section:${route}#${section.id}`,
    kind: 'section',
    label: section.sub ?? section.title,
    keywords: [],
    breadcrumb: section.sub === undefined ? crumbs : [...crumbs, section.title],
    target: { route, anchor: section.id },
    icon: page.icon,
    devOnly: page.devOnly,
  };
  const rows = (section.rows ?? []).map((row): IndexEntry => ({
    id: `${SETTING_ID_PREFIX}${row.key}`,
    kind: 'setting',
    label: row.label,
    keywords: row.keywords ?? [],
    description: row.description,
    hint: row.hint,
    breadcrumb: [...crumbs, ...trail],
    target: { route, anchor: row.key },
    icon: page.icon,
    devOnly: page.devOnly,
  }));
  return [own, ...rows];
};

const settingsSeedEntries = (page: IndexEntry, sections: readonly SearchSectionSeed[]): IndexEntry[] =>
  sections.flatMap((section) => sectionEntries(page, section));

export { settingsSeedEntries };
