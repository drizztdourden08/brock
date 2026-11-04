/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { ConnectionForm } from './connection-form.type';
import { CONNECTION_SLICE, initialConnection } from './connection.constants';

const connectionOfValues = (values: ProfileWizardValues): ConnectionForm =>
  (values[CONNECTION_SLICE] as ConnectionForm | undefined) ?? initialConnection();

export { connectionOfValues };
