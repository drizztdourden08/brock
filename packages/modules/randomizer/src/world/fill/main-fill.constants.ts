/* @layer core @kind constants */
import { runMainFill } from './run-main-fill';
import type { FillPhase } from '../types';

const MAIN_FILL: FillPhase = { id: 'main-fill', run: runMainFill };

export { MAIN_FILL };
