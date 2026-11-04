/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { CreateProfileOptions } from '@drizztdourden08/brock-core';
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';

type ProfileWizardValues = Record<string, unknown>;

interface ProfileWizardStepBodyProps<V extends object> {
  value: V;
  values: ProfileWizardValues;
  onChange: (patch: Partial<V>) => void;
}

interface ProfileWizardStepDef<V extends object = object> {
  id: string;
  slice: string;
  initial: () => V;
  before?: string;
  step: Omit<WizardStepDef<ProfileWizardValues>, 'id'>;
  Body(props: ProfileWizardStepBodyProps<V>): ReactNode;
  toCreate?(value: V, values: ProfileWizardValues): Partial<CreateProfileOptions>;
}

export type { ProfileWizardStepBodyProps, ProfileWizardStepDef, ProfileWizardValues };
