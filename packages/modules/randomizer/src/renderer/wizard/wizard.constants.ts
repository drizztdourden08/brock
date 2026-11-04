/* @layer renderer-shell @kind constants */
import type { RandomizerModeId } from '../../augment';
import type { RandomizerFormState } from '../../contract/randomizer-form-state.type';
import type { RandomizerOptionsSlice } from './randomizer-form.type';

const RANDOMIZER_STEP_ID = 'randomizer';
const OPTIONS_STEP_ID = 'randomizer-options';
const RANDOMIZER_SLICE = 'randomizer';
const OPTIONS_SLICE = 'randomizerOptions';

const MODE_LABELS: Record<RandomizerModeId, string> = { local: 'Local' };

const MODE_OPTIONS = Object.entries(MODE_LABELS).map(([value, label]) => ({ value, label }));

const initialForm = (): RandomizerFormState => ({ enabled: false, seed: '', mode: 'local' });

const initialOptionsSlice = (): RandomizerOptionsSlice => ({ overrides: {} });

export { RANDOMIZER_STEP_ID, OPTIONS_STEP_ID, RANDOMIZER_SLICE, OPTIONS_SLICE, MODE_OPTIONS, initialForm, initialOptionsSlice };
