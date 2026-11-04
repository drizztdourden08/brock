/* @layer renderer-shell @kind logic */
import type { ProfileWizardStepDef, ProfileWizardValues } from './profile-wizard-step.type';

const wizardInitialSlices = (modules: readonly ProfileWizardStepDef[]): ProfileWizardValues =>
  Object.fromEntries(modules.map((module) => [module.slice, module.initial()]));

export { wizardInitialSlices };
