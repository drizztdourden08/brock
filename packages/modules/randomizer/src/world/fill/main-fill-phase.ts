/* @layer core @kind logic */
import { runMainFill } from './run-main-fill';
import type { FillBuild } from '../types/fill-build.type';
import type { FillPhase } from '../types/fill-phase.type';
import type { World } from '../types/world.type';
import type { WorldKeys } from '../types/world-keys.type';

const mainFillPhase = <K extends WorldKeys>(): FillPhase<FillBuild<World<K>>> =>
  ({ id: 'main-fill', run: runMainFill<World<K>> });

export { mainFillPhase };
