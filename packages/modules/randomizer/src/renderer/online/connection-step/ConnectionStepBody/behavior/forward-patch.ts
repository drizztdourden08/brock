/* @layer renderer-shell @kind logic */
import type { RandomizerConnectionValues } from '../../../../../augment';
import type { ConnectionForm } from '../../connection-form.type';

const forwardPatch = (onChange: (patch: Partial<ConnectionForm>) => void) =>
  (patch: Partial<RandomizerConnectionValues>): void => onChange(Object.fromEntries(Object.entries(patch)) as Partial<ConnectionForm>);

export { forwardPatch };
