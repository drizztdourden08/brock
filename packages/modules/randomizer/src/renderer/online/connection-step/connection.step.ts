/* @layer renderer-shell @kind logic */
import type { ProfileWizardStepDef } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../../game-registry/behavior/useRandomizerGameStore';
import { formOf } from '../../wizard/form-of';
import { ONLINE_MODE } from '../online-mode.constants';
import { ConnectionStepBody } from './ConnectionStepBody';
import { connectionOfValues } from './connection-of-values';
import { connectionProblem } from './connection-problem';
import type { ConnectionForm } from './connection-form.type';
import { CONNECTION_SLICE, CONNECTION_STEP_ID, initialConnection } from './connection.constants';

const connectionStep: ProfileWizardStepDef<ConnectionForm> = {
  id: CONNECTION_STEP_ID,
  slice: CONNECTION_SLICE,
  initial: initialConnection,
  step: {
    label: 'Connection',
    description: 'Choose the Archipelago server and slot.',
    when: (values) => {
      const form = formOf(values);
      return useRandomizerGameStore.getState().game?.archipelago !== undefined && form.enabled && form.mode === ONLINE_MODE;
    },
    validate: connectionProblem,
    summary: (values) => connectionOfValues(values).slotName || undefined,
  },
  Body: ConnectionStepBody,
};

export { connectionStep };
