/* @layer core @kind logic */
import { worldModelOf } from '../world-model';
import type { WorldKeys } from '../../world';
import type { PreRolled, PreRolledInput } from './pre-rolled.type';

const preRolledOf = <K extends WorldKeys>(input: PreRolledInput<K>): PreRolled => {
  const { fillWorld, options, hooks, sections } = input;
  return { ...sections?.(fillWorld), world: worldModelOf({ fillWorld, options, hooks }) };
};

export { preRolledOf };
