/* @layer core @kind logic */
import { MAIN_FILL } from '../fill/main-fill.constants';
import type { FillBuild, FillPhase, World, WorldKeys } from '../types';

const phasesWithMainFill = <K extends WorldKeys>(
  phases: readonly FillPhase<FillBuild<World<K>>>[] = [],
): readonly FillPhase<FillBuild<World<K>>>[] =>
    (phases.some((phase) => phase.id === MAIN_FILL.id) ? phases : [...phases, MAIN_FILL]);

export { phasesWithMainFill };
