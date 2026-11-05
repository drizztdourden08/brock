/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import type { RandomizerOptions } from '../../../randomizer-options.type';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { changedCountOf } from './changed-count-of';
import { optionTabsOf } from './option-tabs-of';
import { optionValuesOf } from './option-values-of';
import type { OptionTabModel } from './option-tab-model.type';

const useOptionTab = (overrides: RandomizerOptions, tab?: string, onSelect?: (id: string) => void): OptionTabModel => {
  const game = useRandomizerGame();
  const [picked, setPicked] = useState<{ tab: string | undefined; id: string } | null>(null);
  const catalog = game?.catalog ?? [];
  const values = optionValuesOf(catalog, overrides);
  const tabs = optionTabsOf(game, values);
  const wanted = picked !== null && (picked.tab === tab || tab === undefined) ? picked.id : tab;
  const active = tabs.find((each) => each.id === wanted) ?? tabs[0] ?? null;
  const items = tabs.map(({ id, label, keys }) => ({ id, label, badge: changedCountOf(catalog, values, keys) }));
  const select = (id: string) => {
    setPicked({ tab, id });
    onSelect?.(id);
  };
  return { items, active, values, select };
};

export { useOptionTab };
