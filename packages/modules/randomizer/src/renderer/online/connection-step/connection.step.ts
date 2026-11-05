/* @layer renderer-shell @kind logic */
import type { ProfileWizardStepDef } from '@drizztdourden08/brock-react';
import { ConnectionStepBody } from './ConnectionStepBody';
import { connectionShown } from './connection-shown';
import { connectionSummary } from './connection-summary';
import { connectionValidate } from './connection-validate';
import type { ConnectionForm } from './connection-form.type';
import { CONNECTION_SLICE, CONNECTION_STEP_ID, initialConnection } from './connection.constants';

const connectionStep: ProfileWizardStepDef<ConnectionForm> = {
  id: CONNECTION_STEP_ID,
  slice: CONNECTION_SLICE,
  initial: initialConnection,
  step: {
    label: 'Connection',
    description: 'Choose where this profile connects.',
    when: connectionShown,
    validate: connectionValidate,
    summary: connectionSummary,
  },
  Body: ConnectionStepBody,
};

export { connectionStep };
