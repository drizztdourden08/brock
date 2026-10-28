/* @layer renderer-shell @kind logic */
import type { CommandPaletteGroup } from '@drizztdourden08/tessera/composites';
import { foldText } from '../../../search/fold-text';
import type { PalettePick } from '../../palette.type';
import type { PaletteItem } from '../PaletteHost.type';

const pickGroups = (pick: PalettePick, query: string): CommandPaletteGroup<PaletteItem>[] => {
  const wanted = foldText(query.trim());
  const items = pick.options
    .filter((option) => foldText(option.label).includes(wanted))
    .map((option): PaletteItem => ({ id: `pick:${String(option.value)}`, label: option.label, run: () => pick.onPick(option.value) }));
  return [{ id: 'pick', label: pick.title, items }];
};

export { pickGroups };
