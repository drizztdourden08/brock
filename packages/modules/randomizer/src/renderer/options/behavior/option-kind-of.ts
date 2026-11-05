/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../world/options/option-def.type';
import type { OptionKind } from '../../../world/options/option-parts.type';

const optionKindOf = (option: OptionDef): OptionKind => {
  if (option.kind !== undefined) return option.kind;
  if (option.choices !== undefined) return 'choice';
  if (typeof option.default === 'boolean') return 'toggle';
  return option.range === undefined ? 'text' : 'range';
};

export { optionKindOf };
