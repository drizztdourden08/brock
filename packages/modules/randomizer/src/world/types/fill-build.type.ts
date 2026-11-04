/* @layer core @kind types */
import type { KeysOf } from './keys-of.type';
import type { World } from './world.type';

interface FillBuild<W extends World = World> {
  world: W;
  progression: KeysOf<W>['item'][];
  rest: KeysOf<W>['item'][];
  eligible: () => KeysOf<W>['location'][];
  relaxWhenBeatable: boolean;
}

export type { FillBuild };
