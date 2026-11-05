/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { ProfileWizardStepBodyProps, ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { RandomizerConnectionValues } from '../augment';
import type { RandomizerFormState } from './randomizer-form-state.type';

type ConnectionBody = ComponentType<ProfileWizardStepBodyProps<RandomizerFormState>>;

interface ConnectionView {
  Body: ConnectionBody;
  validate?(connection: RandomizerConnectionValues, values: ProfileWizardValues): string | null;
  summary?(connection: RandomizerConnectionValues, values: ProfileWizardValues): string | undefined;
}

export type { ConnectionBody, ConnectionView };
