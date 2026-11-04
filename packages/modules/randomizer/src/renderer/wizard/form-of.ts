/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { RandomizerFormState } from '../../contract/randomizer-form-state.type';
import { RANDOMIZER_SLICE, initialForm } from './wizard.constants';

const formOf = (values: ProfileWizardValues): RandomizerFormState => (values[RANDOMIZER_SLICE] as RandomizerFormState | undefined) ?? initialForm();

export { formOf };
