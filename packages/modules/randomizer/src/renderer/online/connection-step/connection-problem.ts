/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import { serverAddressError, slotNameError } from '../../../archipelago';
import { connectionOfValues } from './connection-of-values';
import { NO_SLOT_NAME } from './connection.constants';

const connectionProblem = (values: ProfileWizardValues): string | null => {
  const form = connectionOfValues(values);
  const addressProblem = serverAddressError({ host: form.host, port: form.port });
  if (addressProblem !== null) return addressProblem;
  if (form.slotName === '') return NO_SLOT_NAME;
  return slotNameError(form.slotName);
};

export { connectionProblem };
