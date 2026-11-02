/* @layer renderer-shell @kind logic */
import type { CommandPaletteGroup } from '@drizztdourden08/tessera/composites';
import { menuIcon } from '../../../menu/menu-icon';
import { foldText } from '../../../search/fold-text';
import { rankEntries } from '../../../search/rank-entries';
import type { SearchEntry } from '../../../search/search.type';
import type { PalettePick, PickOption } from '../../palette.type';
import type { PaletteItem } from '../PaletteHost.type';

const toEntry = (option: PickOption, index: number): SearchEntry => ({
  id: String(index), kind: 'entry', label: option.label, keywords: option.keywords ?? [], breadcrumb: [], description: option.description,
});

const rankOptions = (options: readonly PickOption[], query: string): PickOption[] =>
  rankEntries(options.map(toEntry), query).flatMap((entry) => options[Number(entry.id)] ?? []);

const matching = (options: readonly PickOption[], query: string, ranked: boolean): readonly PickOption[] => {
  if (query.trim().length === 0) return options;
  if (ranked) return rankOptions(options, query);
  const wanted = foldText(query.trim());
  return options.filter((option) => foldText(option.label).includes(wanted));
};

const toItem = (option: PickOption, pick: PalettePick, scope: string | null): PaletteItem => ({
  id: `pick:${String(option.value)}`,
  label: option.label,
  description: option.description,
  icon: menuIcon(option.icon),
  run: () => pick.onPick(option.value, scope),
});

const splitByGroup = (options: readonly PickOption[]): Map<string, PickOption[]> => {
  const byGroup = new Map<string, PickOption[]>();
  for (const option of options) {
    const key = option.group ?? '';
    byGroup.set(key, [...(byGroup.get(key) ?? []), option]);
  }
  return byGroup;
};

const pickGroups = (pick: PalettePick, query: string, options: readonly PickOption[], scope: string | null): CommandPaletteGroup<PaletteItem>[] => {
  const found = matching(options, query, pick.scopes !== undefined);
  if (found.length === 0) return [{ id: 'pick', label: pick.title, items: [] }];
  return [...splitByGroup(found)].map(([group, members]) => ({
    id: group === '' ? 'pick' : `pick:${group}`,
    label: group === '' ? pick.title : group,
    items: members.map((option) => toItem(option, pick, scope)),
  }));
};

export { pickGroups };
