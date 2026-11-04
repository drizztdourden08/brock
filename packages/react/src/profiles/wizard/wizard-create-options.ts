/* @layer renderer-shell @kind logic */
import type { CreateProfileOptions } from '@drizztdourden08/brock-core';
import type { ProfileWizardStepDef, ProfileWizardValues } from './profile-wizard-step.type';

const wizardCreateOptions = (modules: readonly ProfileWizardStepDef[], values: ProfileWizardValues): Partial<CreateProfileOptions> =>
  modules.reduce<Partial<CreateProfileOptions>>((merged, module) => ({ ...merged, ...(module.toCreate?.(values[module.slice] as object, values) ?? {}) }), {});

export { wizardCreateOptions };
