/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../world/options/option-def.type';
import { groupLabelOf } from './group-label-of';
import type { OptionGroupEntry } from './option-group-entry.type';

const groupsOf = (options: readonly OptionDef[]): readonly OptionGroupEntry[] => {
  const byId = new Map<string, OptionDef[]>();
  options.forEach((option) => {
    const id = option.group ?? '';
    byId.set(id, [...(byId.get(id) ?? []), option]);
  });
  return [...byId].map(([id, list]) => ({ id, label: groupLabelOf(id), options: list }));
};

export { groupsOf };
