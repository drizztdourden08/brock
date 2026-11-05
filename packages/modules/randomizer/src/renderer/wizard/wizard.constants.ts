/* @layer renderer-shell @kind constants */
import type { RandomizerModeId } from '../../augment';
import type { RandomizerFormState } from '../../contract/randomizer-form-state.type';
import type { RandomizerOptionsSlice } from './randomizer-form.type';

const RANDOMIZER_STEP_ID = 'randomizer';
const OPTIONS_STEP_ID = 'randomizer-options';
const RANDOMIZER_SLICE = 'randomizer';
const OPTIONS_SLICE = 'randomizerOptions';

const MODE_LABELS: Partial<Record<RandomizerModeId, string>> = { local: 'Local', online: 'Online' };

const MODE_RANKS: Partial<Record<RandomizerModeId, number>> = { local: 0, online: 100 };

const initialForm =(): RandomizerFormState => ({ enabled: false, seed: '', mode: 'local' });

const initialOptionsSlice = (): RandomizerOptionsSlice => ({ overrides: {} });

export { RANDOMIZER_STEP_ID, OPTIONS_STEP_ID, RANDOMIZER_SLICE, OPTIONS_SLICE, MODE_LABELS, MODE_RANKS, initialForm, initialOptionsSlice };
