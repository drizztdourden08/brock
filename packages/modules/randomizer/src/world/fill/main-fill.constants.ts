/* @layer core @kind constants */
import { mainFillPhase } from './main-fill-phase';
import type { FillPhase, WorldKeys } from '../types';

const MAIN_FILL: FillPhase = mainFillPhase<WorldKeys>();

export { MAIN_FILL };
