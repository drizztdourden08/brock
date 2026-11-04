/* @layer core @kind logic */
import type { OptionRef } from '../../types/option-ref.type';
import type { WorldKeys } from '../../types/world-keys.type';

const optionRef = <K extends WorldKeys>(key: K['option']): OptionRef<K> => ({ option: key });

export { optionRef };
