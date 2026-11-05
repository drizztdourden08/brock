/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../../world/options/option-def.type';

const hasDescription = (option: OptionDef): boolean =>
  (option.details?.length ?? 0) > 0 || (option.description ?? option.hint ?? '') !== '';

export { hasDescription };
