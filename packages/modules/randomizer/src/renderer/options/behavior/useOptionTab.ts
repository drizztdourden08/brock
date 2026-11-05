/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import type { RandomizerOptions } from '../../../randomizer-options.type';
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { changedCountOf } from './changed-count-of';
import { optionTabsOf } from './option-tabs-of';
import { optionValuesOf } from './option-values-of';
import type { OptionTabModel } from './option-tab-model.type';

const useOptionTab = (overrides: RandomizerOptions, tab?: string): OptionTabModel => {
  const game = useRandomizerGame();
  const [chosen, setChosen] = useState<string | null>(null);
  const catalog = game?.catalog ?? [];
  const values = optionValuesOf(catalog, overrides);
  const tabs = optionTabsOf(game, values);
  const wanted = tab ?? chosen;
  const active = tabs.find((each) => each.id === wanted) ?? tabs[0] ?? null;
  const items = tabs.map(({ id, label, keys }) => ({ id, label, badge: changedCountOf(catalog, values, keys) }));
  return { items, active, values, select: setChosen };
};

export { useOptionTab };
