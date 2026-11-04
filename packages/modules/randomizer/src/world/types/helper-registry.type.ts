/* @layer core @kind types */
import type { HelperDefinition } from './helper-definition.type';
import type { KeysOf } from './keys-of.type';
import type { World } from './world.type';

type HelperRegistry<W extends World = World> = ReadonlyMap<KeysOf<W>['helper'], HelperDefinition<W>>;

export type { HelperRegistry };
