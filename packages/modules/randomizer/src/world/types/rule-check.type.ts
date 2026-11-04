/* @layer core @kind types */
import type { CollectionState } from './collection-state.type';
import type { World } from './world.type';

type RuleCheck<W extends World = World> = (state: CollectionState<W>) => boolean;

export type { RuleCheck };
