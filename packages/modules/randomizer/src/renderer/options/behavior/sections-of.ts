/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../world/options/option-def.type';

const sectionsOf = (catalog: readonly OptionDef[]): ReadonlyArray<readonly [string, readonly OptionDef[]]> => {
  const groups = new Map<string, OptionDef[]>([['', []]]);
  catalog.forEach((option) => {
    const key = option.section ?? '';
    groups.set(key, [...(groups.get(key) ?? []), option]);
  });
  return [...groups].filter(([, options]) => options.length > 0);
};

export { sectionsOf };
