/* @layer renderer-shell @kind logic */
import type { RandomizerFormState } from '../../../../../contract/randomizer-form-state.type';
import type { ConnectionForm } from '../../connection-form.type';

const forwardPatch = (onChange: (patch: Partial<ConnectionForm>) => void) =>
  (patch: Partial<RandomizerFormState>): void => onChange(Object.fromEntries(Object.entries(patch)));

export { forwardPatch };
