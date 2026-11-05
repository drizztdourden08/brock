/* @layer renderer-shell @kind logic */
import type { OptionDef } from '../../../world/options/option-def.type';

const isUpcoming = (option: OptionDef): boolean => option.implementation === 'not-implemented';

export { isUpcoming };
