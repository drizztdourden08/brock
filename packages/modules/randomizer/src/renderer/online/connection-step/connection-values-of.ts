/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { RandomizerConnectionValues } from '../../../augment';
import { CONNECTION_SLICE } from './connection.constants';

const connectionValuesOf = (values: ProfileWizardValues): RandomizerConnectionValues => {
  const slice = values[CONNECTION_SLICE];
  return typeof slice === 'object' && slice !== null ? (slice as RandomizerConnectionValues) : {};
};

export { connectionValuesOf };
