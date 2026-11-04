/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { RandomizerOptionsSlice } from './randomizer-form.type';
import { OPTIONS_SLICE, initialOptionsSlice } from './wizard.constants';

const optionsSliceOf = (values: ProfileWizardValues): RandomizerOptionsSlice =>
  (values[OPTIONS_SLICE] as RandomizerOptionsSlice | undefined) ?? initialOptionsSlice();

export { optionsSliceOf };
