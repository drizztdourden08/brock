/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../world/options/option-def.type';

const tagFor = (option: OptionDef): string | null => {
  if (option.frozen !== true) return null;
  if (option.implementation === 'not-implemented') return 'not in this version';
  if (option.implementation === 'not-applicable') return 'not used here';
  return 'fixed';
};

export { tagFor };
